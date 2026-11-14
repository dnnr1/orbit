import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { db } from '@orbit/db';
import { bookings, rooms, availabilitySchedules, organizations, users, bookingApprovals } from '@orbit/db';
import { eq, and, or, lt, gt, between } from 'drizzle-orm';
import { generateId } from '@orbit/shared';
import { 
  CreateBooking, 
  UpdateBooking, 
  CancelBooking, 
  ApproveBooking, 
  RejectBooking,
  BOOKING_STATUS,
  APPROVAL_STATUS
} from '@orbit/shared';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async findAll(
    organizationId: string,
    userOrgId: string,
    user: { id: string; role: string },
    filters: { status?: string; roomId?: string; from?: string; to?: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const conditions = [eq(bookings.organizationId, organizationId)];
    
    if (filters.status) {
      conditions.push(eq(bookings.status, filters.status as any));
    }
    if (filters.roomId) {
      conditions.push(eq(bookings.roomId, filters.roomId));
    }
    if (filters.from) {
      conditions.push(gt(bookings.startsAt, new Date(filters.from)));
    }
    if (filters.to) {
      conditions.push(lt(bookings.startsAt, new Date(filters.to)));
    }

    if (!['super_admin', 'org_admin', 'manager'].includes(user.role)) {
      conditions.push(eq(bookings.bookerId, user.id));
    }

    return db.query.bookings.findMany({
      where: and(...conditions),
      orderBy: (b, { desc }) => [desc(b.startsAt)],
    });
  }

  async findById(
    organizationId: string,
    id: string,
    userOrgId: string,
    user: { id: string; role: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const booking = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.id, id),
        eq(bookings.organizationId, organizationId)
      ),
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!['super_admin', 'org_admin', 'manager'].includes(user.role) && booking.bookerId !== user.id) {
      throw new ForbiddenException('Access denied to this booking');
    }

    return booking;
  }

  async create(
    organizationId: string,
    data: CreateBooking,
    userOrgId: string,
    user: { id: string; role: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const room = await db.query.rooms.findFirst({
      where: and(
        eq(rooms.id, data.roomId),
        eq(rooms.organizationId, organizationId)
      ),
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== 'active') {
      throw new BadRequestException('Room is not available for booking');
    }

    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });

    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);

    if (startsAt >= endsAt) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startsAt < new Date()) {
      throw new BadRequestException('Cannot book in the past');
    }

    const maxAdvanceDays = org?.settings?.maxAdvanceBookingDays || 30;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
    if (startsAt > maxDate) {
      throw new BadRequestException(`Cannot book more than ${maxAdvanceDays} days in advance`);
    }

    await this.validateSchedule(room.id, startsAt, endsAt);
    await this.checkConflicts(data.roomId, startsAt, endsAt);

    const requiresApproval = org?.settings?.requireApproval ?? true;
    const status = requiresApproval ? BOOKING_STATUS.PENDING : BOOKING_STATUS.APPROVED;

    const [booking] = await db
      .insert(bookings)
      .values({
        id: generateId(),
        roomId: data.roomId,
        organizationId,
        bookerId: user.id,
        title: data.title,
        description: data.description ?? null,
        startsAt,
        endsAt,
        status,
        requiresApproval,
      })
      .returning();

    if (requiresApproval) {
      await this.createApprovalRequest(booking.id, organizationId, user.id);
    }

    await this.sendBookingConfirmation(booking, room.name);

    return booking;
  }

  async update(
    organizationId: string,
    id: string,
    data: UpdateBooking,
    userOrgId: string,
    user: { id: string; role: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const booking = await this.findById(organizationId, id, userOrgId, user);

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new BadRequestException('Cannot modify a cancelled booking');
    }
    if (booking.status === BOOKING_STATUS.COMPLETED) {
      throw new BadRequestException('Cannot modify a completed booking');
    }

    const startsAt = data.startsAt ? new Date(data.startsAt) : booking.startsAt;
    const endsAt = data.endsAt ? new Date(data.endsAt) : booking.endsAt;

    if (startsAt >= endsAt) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (startsAt < new Date()) {
      throw new BadRequestException('Cannot move booking to the past');
    }

    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, booking.roomId),
    });

    await this.validateSchedule(room!.id, startsAt, endsAt);
    await this.checkConflicts(booking.roomId, startsAt, endsAt, id);

    const requiresApproval = booking.requiresApproval;
    let newStatus = booking.status;
    if (requiresApproval && booking.status === BOOKING_STATUS.APPROVED) {
      newStatus = BOOKING_STATUS.PENDING;
    }

    const [updated] = await db
      .update(bookings)
      .set({
        ...data,
        startsAt,
        endsAt,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    if (requiresApproval && newStatus === BOOKING_STATUS.PENDING) {
      await this.createApprovalRequest(updated.id, organizationId, user.id);
    }

    return updated;
  }

  async cancel(
    organizationId: string,
    id: string,
    data: CancelBooking,
    userOrgId: string,
    user: { id: string; role: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const booking = await this.findById(organizationId, id, userOrgId, user);

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new BadRequestException('Booking already cancelled');
    }
    if (booking.status === BOOKING_STATUS.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }
    if (booking.status === BOOKING_STATUS.APPROVED && !['super_admin', 'org_admin', 'manager'].includes(user.role)) {
      throw new BadRequestException('Cannot cancel an approved booking. Contact an administrator.');
    }

    const [cancelled] = await db
      .update(bookings)
      .set({
        status: BOOKING_STATUS.CANCELLED,
        cancelledAt: new Date(),
        cancelledBy: user.id,
        cancelReason: data.reason ?? null,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    await this.notificationsService.create({
      userId: booking.bookerId,
      organizationId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking "${booking.title}" has been cancelled.`,
      data: { bookingId: booking.id },
    });

    return cancelled;
  }

  async approve(
    organizationId: string,
    id: string,
    data: ApproveBooking,
    userOrgId: string,
    user: { id: string; role: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const booking = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.id, id),
        eq(bookings.organizationId, organizationId)
      ),
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new BadRequestException('Booking is not pending approval');
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: BOOKING_STATUS.APPROVED,
        approvedBy: user.id,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    await db
      .update(bookingApprovals)
      .set({
        status: APPROVAL_STATUS.APPROVED,
        comment: data.comment ?? null,
        decidedAt: new Date(),
      })
      .where(eq(bookingApprovals.bookingId, id));

    await this.notificationsService.create({
      userId: booking.bookerId,
      organizationId,
      type: 'booking_confirmed',
      title: 'Booking Approved',
      message: `Your booking "${booking.title}" has been approved.`,
      data: { bookingId: booking.id },
    });

    return updated;
  }

  async reject(
    organizationId: string,
    id: string,
    data: RejectBooking,
    userOrgId: string,
    user: { id: string; role: string }
  ) {
    this.validateOrgAccess(organizationId, userOrgId);

    const booking = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.id, id),
        eq(bookings.organizationId, organizationId)
      ),
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new BadRequestException('Booking is not pending approval');
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: BOOKING_STATUS.REJECTED,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    await db
      .update(bookingApprovals)
      .set({
        status: APPROVAL_STATUS.REJECTED,
        comment: data.reason,
        decidedAt: new Date(),
      })
      .where(eq(bookingApprovals.bookingId, id));

    await this.notificationsService.create({
      userId: booking.bookerId,
      organizationId,
      type: 'booking_rejected',
      title: 'Booking Rejected',
      message: `Your booking "${booking.title}" has been rejected: ${data.reason}`,
      data: { bookingId: booking.id },
    });

    return updated;
  }

  private async validateSchedule(roomId: string, startsAt: Date, endsAt: Date) {
    const schedule = await db.query.availabilitySchedules.findFirst({
      where: eq(availabilitySchedules.roomId, roomId),
    });

    if (!schedule) return;

    const day = startsAt.getDay();
    const daySchedule = schedule.schedule[day];

    if (!daySchedule?.enabled) {
      throw new BadRequestException('Room is not available on this day');
    }

    const startMinutes = startsAt.getHours() * 60 + startsAt.getMinutes();
    const endMinutes = endsAt.getHours() * 60 + endsAt.getMinutes();

    const withinSchedule = daySchedule.slots.some(
      (slot: { start: string; end: string }) => {
        const slotStart = this.timeToMinutes(slot.start);
        const slotEnd = this.timeToMinutes(slot.end);
        return startMinutes >= slotStart && endMinutes <= slotEnd;
      }
    );

    if (!withinSchedule) {
      throw new BadRequestException('Booking time is outside room availability');
    }
  }

  private async checkConflicts(roomId: string, startsAt: Date, endsAt: Date, excludeId?: string) {
    const conditions = [
      eq(bookings.roomId, roomId),
      or(
        eq(bookings.status, BOOKING_STATUS.PENDING),
        eq(bookings.status, BOOKING_STATUS.APPROVED)
      ),
      and(
        lt(bookings.startsAt, endsAt),
        gt(bookings.endsAt, startsAt)
      ),
    ];

    if (excludeId) {
      conditions.push(eq(bookings.id, excludeId));
    }

    const conflict = await db.query.bookings.findFirst({
      where: and(...conditions),
    });

    if (conflict) {
      throw new BadRequestException('Room is already booked for the selected time');
    }
  }

  private async createApprovalRequest(bookingId: string, organizationId: string, requestedBy: string) {
    const approvers = await db.query.users.findMany({
      where: and(
        eq(users.organizationId, organizationId),
        or(
          eq(users.role, 'org_admin'),
          eq(users.role, 'manager')
        )
      ),
    });

    if (approvers.length > 0) {
      await db.insert(bookingApprovals).values({
        id: generateId(),
        bookingId,
        organizationId,
        requestedBy,
        approverId: approvers[0].id,
        status: APPROVAL_STATUS.PENDING,
      });

      await this.notificationsService.create({
        userId: approvers[0].id,
        organizationId,
        type: 'approval_requested',
        title: 'Booking Approval Requested',
        message: 'A new booking requires your approval.',
        data: { bookingId },
      });
    }
  }

  private async sendBookingConfirmation(booking: any, roomName: string) {
    await this.notificationsService.create({
      userId: booking.bookerId,
      organizationId: booking.organizationId,
      type: 'booking_confirmed',
      title: booking.requiresApproval ? 'Booking Submitted' : 'Booking Confirmed',
      message: `Your booking "${booking.title}" for ${roomName} has been ${booking.requiresApproval ? 'submitted for approval' : 'confirmed'}.`,
      data: { bookingId: booking.id },
    });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private validateOrgAccess(organizationId: string, userOrgId: string) {
    if (organizationId !== userOrgId) {
      throw new ForbiddenException('Access denied to this organization');
    }
  }
}