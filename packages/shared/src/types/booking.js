import { z } from 'zod';
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
