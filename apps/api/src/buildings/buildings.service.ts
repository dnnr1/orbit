import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { db } from '@orbit/db';
import { buildings, organizations } from '@orbit/db';
import { eq, and } from 'drizzle-orm';
import { generateId } from '@orbit/shared';
import { CreateBuilding, UpdateBuilding } from '@orbit/shared';

@Injectable()
export class BuildingsService {
  async findAll(organizationId: string, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    return db.query.buildings.findMany({
      where: eq(buildings.organizationId, organizationId),
      orderBy: (b, { asc }) => [asc(b.name)],
    });
  }

  async findById(organizationId: string, id: string, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const building = await db.query.buildings.findFirst({
      where: and(
        eq(buildings.id, id),
        eq(buildings.organizationId, organizationId)
      ),
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return building;
  }

  async create(organizationId: string, data: CreateBuilding, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const [building] = await db
      .insert(buildings)
      .values({
        id: generateId(),
        organizationId,
        name: data.name,
        address: data.address ?? null,
      })
      .returning();

    return building;
  }

  async update(organizationId: string, id: string, data: UpdateBuilding, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const [building] = await db
      .update(buildings)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(buildings.id, id),
          eq(buildings.organizationId, organizationId)
        )
      )
      .returning();

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return building;
  }

  async remove(organizationId: string, id: string, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const [building] = await db
      .delete(buildings)
      .where(
        and(
          eq(buildings.id, id),
          eq(buildings.organizationId, organizationId)
        )
      )
      .returning();

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return { deleted: true };
  }

  private validateOrgAccess(organizationId: string, userOrgId: string) {
    if (organizationId !== userOrgId) {
      throw new UnauthorizedException('Access denied to this organization');
    }
  }
}