import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { bookings } from './bookings';
import { users } from './users';
import { organizations } from './organizations';
import { APPROVAL_STATUS } from "../../../shared/src";
export const bookingApprovals = pgTable('booking_approvals', {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
        .notNull()
        .references(() => bookings.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
        .notNull()
        .references(() => organizations.id, { onDelete: 'cascade' }),
    requestedBy: uuid('requested_by')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    approverId: uuid('approver_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status')
        .notNull()
        .default(APPROVAL_STATUS.PENDING)
        .$type(),
    comment: text('comment'),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
