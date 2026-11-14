import { z } from 'zod';
import { DAYS_OF_WEEK } from '../constants';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface AvailabilitySchedule {
  id: string;
  roomId: string;
  organizationId: string;
  schedule: DaySchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export const TimeSlotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format, use HH:MM'),
  end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format, use HH:MM'),
});

export const DayScheduleSchema = z.object({
  enabled: z.boolean(),
  slots: z.array(TimeSlotSchema).min(0),
});

export const CreateAvailabilityScheduleSchema = z.object({
  roomId: z.string().uuid(),
  schedule: z.array(DayScheduleSchema).length(7),
});

export const UpdateAvailabilityScheduleSchema = z.object({
  schedule: z.array(DayScheduleSchema).length(7),
});

export type CreateAvailabilitySchedule = z.infer<typeof CreateAvailabilityScheduleSchema>;
export type UpdateAvailabilitySchedule = z.infer<typeof UpdateAvailabilityScheduleSchema>;

export const DEFAULT_DAY_SCHEDULE: DaySchedule = {
  enabled: false,
  slots: [],
};

export const DEFAULT_WEEK_SCHEDULE: DaySchedule[] = [
  { enabled: false, slots: [] },
  { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  { enabled: false, slots: [] },
];