export class OrbitError extends Error {
    constructor(message, code, statusCode = 500, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends OrbitError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}
export class AuthenticationError extends OrbitError {
    constructor(message = 'Authentication required') {
        super(message, 'AUTHENTICATION_ERROR', 401);
    }
}
export class UnauthorizedError extends OrbitError {
    constructor(message = 'Insufficient permissions') {
        super(message, 'UNAUTHORIZED', 403);
    }
}
export class NotFoundError extends OrbitError {
    constructor(resource, id) {
        super(id ? `${resource} with id ${id} not found` : `${resource} not found`, 'NOT_FOUND', 404);
    }
}
export class ConflictError extends OrbitError {
    constructor(message) {
        super(message, 'CONFLICT', 409);
    }
}
export class RateLimitError extends OrbitError {
    constructor(message = 'Too many requests') {
        super(message, 'RATE_LIMIT', 429);
    }
}
export class ServiceUnavailableError extends OrbitError {
    constructor(message = 'Service temporarily unavailable') {
        super(message, 'SERVICE_UNAVAILABLE', 503);
    }
}
export class BusinessError extends OrbitError {
    constructor(message, code = 'BUSINESS_ERROR') {
        super(message, code, 422);
    }
}
export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT: 'RATE_LIMIT',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
    BOOKING_CONFLICT: 'BOOKING_CONFLICT',
    ORG_NOT_FOUND: 'ORG_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    BUILDING_NOT_FOUND: 'BUILDING_NOT_FOUND',
    SCHEDULE_NOT_FOUND: 'SCHEDULE_NOT_FOUND',
    BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
    INVALID_BOOKING_TIME: 'INVALID_BOOKING_TIME',
    BOOKING_PAST: 'BOOKING_PAST',
    BOOKING_TOO_FAR: 'BOOKING_TOO_FAR',
    OVERLAPPING_BOOKING: 'OVERLAPPING_BOOKING',
    CANNOT_CANCEL_APPROVED: 'CANNOT_CANCEL_APPROVED',
    CANNOT_MODIFY_CANCELLED: 'CANNOT_MODIFY_CANCELLED',
    APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    USER_INACTIVE: 'USER_INACTIVE',
};
