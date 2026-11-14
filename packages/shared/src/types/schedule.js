import { z } from 'zod';
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
export const DEFAULT_DAY_SCHEDULE = {
    enabled: false,
    slots: [],
};
export const DEFAULT_WEEK_SCHEDULE = [
    { enabled: false, slots: [] },
    { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { enabled: false, slots: [] },
];
