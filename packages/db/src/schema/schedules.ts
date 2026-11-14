import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { rooms } from './rooms';
import { organizations } from './organizations';

export const availabilitySchedules = pgTable('availability_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id')
    .notNull()
    .references(() => rooms.id, { onDelete: 'cascade' })
    .unique(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  schedule: jsonb('schedule').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AvailabilitySchedule = typeof availabilitySchedules.$inferSelect;
export type NewAvailabilitySchedule = typeof availabilitySchedules.$inferInsert;