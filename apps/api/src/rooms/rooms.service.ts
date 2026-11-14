import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '@orbit/db';
import { rooms, buildings } from '@orbit/db';
import { eq, and } from 'drizzle-orm';
import { generateId } from '@orbit/shared';
import { CreateRoom, UpdateRoom } from '@orbit/shared';

@Injectable()
export class RoomsService {
  async findAll(organizationId: string, userOrgId: string, buildingId?: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const conditions = [eq(rooms.organizationId, organizationId)];
    if (buildingId) {
      conditions.push(eq(rooms.buildingId, buildingId));
    }

    return db.query.rooms.findMany({
      where: and(...conditions),
      orderBy: (r, { asc }) => [asc(r.name)],
    });
  }

  async findById(organizationId: string, id: string, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const room = await db.query.rooms.findFirst({
      where: and(
        eq(rooms.id, id),
        eq(rooms.organizationId, organizationId)
      ),
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async create(organizationId: string, buildingId: string, data: CreateRoom, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const building = await db.query.buildings.findFirst({
      where: and(
        eq(buildings.id, buildingId),
        eq(buildings.organizationId, organizationId)
      ),
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    const existing = await db.query.rooms.findFirst({
      where: and(
        eq(rooms.organizationId, organizationId),
        eq(rooms.code, data.code)
      ),
    });

    if (existing) {
      throw new ConflictException('Room code already exists in this organization');
    }

    const [room] = await db
      .insert(rooms)
      .values({
        id: generateId(),
        buildingId,
        organizationId,
        name: data.name,
        code: data.code,
        capacity: data.capacity,
        floor: data.floor ?? null,
        resources: data.resources ?? [],
        description: data.description ?? null,
        status: 'active',
      })
      .returning();

    return room;
  }

  async update(organizationId: string, id: string, data: UpdateRoom, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    if (data.code) {
      const existing = await db.query.rooms.findFirst({
        where: and(
          eq(rooms.organizationId, organizationId),
          eq(rooms.code, data.code)
        ),
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Room code already exists in this organization');
      }
    }

    const [room] = await db
      .update(rooms)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(rooms.id, id),
          eq(rooms.organizationId, organizationId)
        )
      )
      .returning();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async remove(organizationId: string, id: string, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const [room] = await db
      .delete(rooms)
      .where(
        and(
          eq(rooms.id, id),
          eq(rooms.organizationId, organizationId)
        )
      )
      .returning();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return { deleted: true };
  }

  private validateOrgAccess(organizationId: string, userOrgId: string) {
    if (organizationId !== userOrgId) {
      throw new UnauthorizedException('Access denied to this organization');
    }
  }
}