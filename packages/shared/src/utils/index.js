import bcrypt from 'bcryptjs';
export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
export function generateId() {
    return crypto.randomUUID();
}
export function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
export function isOverlap(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}
export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
export function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
export function getDayOfWeek(date) {
    return date.getDay();
}
export function formatDateTime(date) {
    return date.toISOString();
}
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function isWithinSchedule(date, schedule) {
    const day = date.getDay();
    const daySchedule = schedule[day];
    if (!daySchedule || !daySchedule.enabled)
        return false;
    const timeMinutes = date.getHours() * 60 + date.getMinutes();
    return daySchedule.slots.some(slot => {
        const startMinutes = timeToMinutes(slot.start);
        const endMinutes = timeToMinutes(slot.end);
        return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
}
