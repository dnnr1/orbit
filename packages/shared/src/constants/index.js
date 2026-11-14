export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ORG_ADMIN: 'org_admin',
    MANAGER: 'manager',
    BOOKER: 'booker',
};
export const BOOKING_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    NO_SHOW: 'no_show',
};
export const APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};
export const NOTIFICATION_TYPES = {
    BOOKING_CONFIRMED: 'booking_confirmed',
    BOOKING_REJECTED: 'booking_rejected',
    BOOKING_CANCELLED: 'booking_cancelled',
    BOOKING_REMINDER: 'booking_reminder',
    APPROVAL_REQUESTED: 'approval_requested',
    APPROVAL_DECIDED: 'approval_decided',
};
export const ROOM_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    MAINTENANCE: 'maintenance',
};
export const ORG_STATUS = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
};
export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
};
export const DAYS_OF_WEEK = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};
export const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
export const DAY_ABBREVIATIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DEFAULT_TIMEZONE = 'UTC';
export const MIN_BOOKING_DURATION_MINUTES = 15;
export const MAX_BOOKING_DURATION_DAYS = 30;
export const MAX_BOOKINGS_PER_USER_PER_DAY = 10;
export const TOKEN_TYPES = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    PASSWORD_RESET: 'password_reset',
    EMAIL_VERIFY: 'email_verify',
};
