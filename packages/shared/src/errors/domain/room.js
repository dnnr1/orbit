import { OrbitError } from '../index';
export class RoomNotFoundError extends OrbitError {
    constructor(id) {
        super(id ? `Room with id ${id} not found` : 'Room not found', 'ROOM_NOT_FOUND', 404);
    }
}
export class BuildingNotFoundError extends OrbitError {
    constructor(id) {
        super(id ? `Building with id ${id} not found` : 'Building not found', 'BUILDING_NOT_FOUND', 404);
    }
}
export class ScheduleNotFoundError extends OrbitError {
    constructor(id) {
        super(id ? `Schedule with id ${id} not found` : 'Schedule not found', 'SCHEDULE_NOT_FOUND', 404);
    }
}
export class OrgNotFoundError extends OrbitError {
    constructor(id) {
        super(id ? `Organization with id ${id} not found` : 'Organization not found', 'ORG_NOT_FOUND', 404);
    }
}
export class UserNotFoundError extends OrbitError {
    constructor(id) {
        super(id ? `User with id ${id} not found` : 'User not found', 'USER_NOT_FOUND', 404);
    }
}
