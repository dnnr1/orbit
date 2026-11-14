import { z } from 'zod';
import { NOTIFICATION_TYPES } from '../constants';

export interface Notification {
  id: string;
  userId: string;
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    NOTIFICATION_TYPES.BOOKING_REJECTED,
    NOTIFICATION_TYPES.BOOKING_CANCELLED,
    NOTIFICATION_TYPES.BOOKING_REMINDER,
    NOTIFICATION_TYPES.APPROVAL_REQUESTED,
    NOTIFICATION_TYPES.APPROVAL_DECIDED,
  ]),
  title: z.string().min(1).max(200),
  message: z.string().max(1000),
  data: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CreateNotification = z.infer<typeof CreateNotificationSchema>;