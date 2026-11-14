import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { ROLES, USER_STATUS } from "../../../shared/src";
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
        .$type(),
    status: text('status')
        .notNull()
        .default(USER_STATUS.ACTIVE)
        .$type(),
    emailVerified: boolean('email_verified').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
