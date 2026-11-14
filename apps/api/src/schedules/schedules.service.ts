import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { db } from '@orbit/db';
import { availabilitySchedules, rooms } from '@orbit/db';
import { eq, and } from 'drizzle-orm';
import { generateId } from '@orbit/shared';
import { 
  CreateAvailabilitySchedule, 
  UpdateAvailabilitySchedule,
  DEFAULT_WEEK_SCHEDULE 
} from '@orbit/shared';

@Injectable()
export class SchedulesService {
  async getSchedule(organizationId: string, roomId: string, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const room = await db.query.rooms.findFirst({
      where: and(
        eq(rooms.id, roomId),
        eq(rooms.organizationId, organizationId)
      ),
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const schedule = await db.query.availabilitySchedules.findFirst({
      where: eq(availabilitySchedules.roomId, roomId),
    });

    if (!schedule) {
      const [created] = await db
        .insert(availabilitySchedules)
        .values({
          id: generateId(),
          roomId,
          organizationId,
          schedule: DEFAULT_WEEK_SCHEDULE,
        })
        .returning();
      return created;
    }

    return schedule;
  }

  async create(organizationId: string, roomId: string, data: CreateAvailabilitySchedule, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const room = await db.query.rooms.findFirst({
      where: and(
        eq(rooms.id, roomId),
        eq(rooms.organizationId, organizationId)
      ),
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const existing = await db.query.availabilitySchedules.findFirst({
      where: eq(availabilitySchedules.roomId, roomId),
    });

    if (existing) {
      const [updated] = await db
        .update(availabilitySchedules)
        .set({ schedule: data.schedule, updatedAt: new Date() })
        .where(eq(availabilitySchedules.roomId, roomId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(availabilitySchedules)
      .values({
        id: generateId(),
        roomId,
        organizationId,
        schedule: data.schedule,
      })
      .returning();

    return created;
  }

  async update(organizationId: string, roomId: string, data: UpdateAvailabilitySchedule, userOrgId: string) {
    this.validateOrgAccess(organizationId, userOrgId);

    const schedule = await db.query.availabilitySchedules.findFirst({
      where: eq(availabilitySchedules.roomId, roomId),
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    const [updated] = await db
      .update(availabilitySchedules)
      .set({ schedule: data.schedule, updatedAt: new Date() })
      .where(eq(availabilitySchedules.roomId, roomId))
      .returning();

    return updated;
  }

  private validateOrgAccess(organizationId: string, userOrgId: string) {
    if (organizationId !== userOrgId) {
      throw new UnauthorizedException('Access denied to this organization');
    }
  }
}