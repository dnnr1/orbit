import { z } from 'zod';
import { BOOKING_STATUS, APPROVAL_STATUS } from '../constants';

export interface Booking {
  id: string;
  roomId: string;
  organizationId: string;
  bookerId: string;
  title: string;
  description: string | null;
  startsAt: Date;
  endsAt: Date;
  status: (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
  requiresApproval: boolean;
  approvedBy: string | null;
  approvedAt: Date | null;
  cancelledAt: Date | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingApproval {
  id: string;
  bookingId: string;
  organizationId: string;
  requestedBy: string;
  approverId: string;
  status: (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];
  comment: string | null;
  decidedAt: Date | null;
  createdAt: Date;
}

export const CreateBookingSchema = z.object({
  roomId: z.string().uuid(),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).nullable().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export const UpdateBookingSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export const CancelBookingSchema = z.object({
  reason: z.string().max(500).nullable().optional(),
});

export const ApproveBookingSchema = z.object({
  comment: z.string().max(500).nullable().optional(),
});

export const RejectBookingSchema = z.object({
  reason: z.string().min(1).max(500),
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;
export type UpdateBooking = z.infer<typeof UpdateBookingSchema>;
export type CancelBooking = z.infer<typeof CancelBookingSchema>;
export type ApproveBooking = z.infer<typeof ApproveBookingSchema>;
export type RejectBooking = z.infer<typeof RejectBookingSchema>;