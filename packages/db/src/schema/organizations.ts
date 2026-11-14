import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';
import { ORG_STATUS } from '@orbit/shared';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status')
    .notNull()
    .default(ORG_STATUS.ACTIVE)
    .$type<typeof ORG_STATUS[keyof typeof ORG_STATUS]>(),
  settings: jsonb('settings')
    .notNull()
    .default({
      timezone: 'UTC',
      allowOverlappingBookings: false,
      requireApproval: true,
      maxAdvanceBookingDays: 30,
      minBookingNoticeHours: 1,
    }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;