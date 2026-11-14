import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { ROLES, USER_STATUS } from '@orbit/shared';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role')
    .notNull()
    .default(ROLES.BOOKER)
    .$type<typeof ROLES[keyof typeof ROLES]>(),
  status: text('status')
    .notNull()
    .default(USER_STATUS.ACTIVE)
    .$type<typeof USER_STATUS[keyof typeof USER_STATUS]>(),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;