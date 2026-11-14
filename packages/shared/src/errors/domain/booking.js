import { BusinessError, OrbitError } from '../index';
export class BookingConflictError extends OrbitError {
    constructor(message) {
        super(message, 'BOOKING_CONFLICT', 409);
    }
}
export class InvalidBookingTimeError extends BusinessError {
    constructor(message) {
        super(message, 'INVALID_BOOKING_TIME');
    }
}
export class BookingPastError extends BusinessError {
    constructor() {
        super('Cannot create a booking in the past', 'BOOKING_PAST');
    }
}
export class BookingTooFarError extends BusinessError {
    constructor(maxDays) {
        super(`Cannot book more than ${maxDays} days in advance`, 'BOOKING_TOO_FAR');
    }
}
export class OverlappingBookingError extends BusinessError {
    constructor() {
        super('Room is already booked for the selected time', 'OVERLAPPING_BOOKING');
    }
}
export class CannotCancelApprovedError extends BusinessError {
    constructor() {
        super('Cannot cancel an approved booking. Contact an administrator.', 'CANNOT_CANCEL_APPROVED');
    }
}
export class CannotModifyCancelledError extends BusinessError {
    constructor() {
        super('Cannot modify a cancelled booking', 'CANNOT_MODIFY_CANCELLED');
    }
}
export class ApprovalRequiredError extends BusinessError {
    constructor() {
        super('This booking requires approval', 'APPROVAL_REQUIRED');
    }
}
export class BookingNotFoundError extends OrbitError {
    constructor(id) {
        super(id ? `Booking with id ${id} not found` : 'Booking not found', 'BOOKING_NOT_FOUND', 404);
    }
}
