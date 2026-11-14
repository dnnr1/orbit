import { Injectable } from '@nestjs/common';
import { db } from '@orbit/db';
import { notifications } from '@orbit/db';
import { eq, and, desc } from 'drizzle-orm';
import { generateId } from '@orbit/shared';
import { CreateNotification } from '@orbit/shared';

@Injectable()
export class NotificationsService {
  async findAll(userId: string, unreadOnly = false) {
    const conditions = [eq(notifications.userId, userId)];
    if (unreadOnly) {
      conditions.push(eq(notifications.read, false));
    }

    return db.query.notifications.findMany({
      where: and(...conditions),
      orderBy: (n, { desc }) => [desc(n.createdAt)],
    });
  }

  async create(data: CreateNotification) {
    const [notification] = await db
      .insert(notifications)
      .values({
        id: generateId(),
        userId: data.userId,
        organizationId: data.organizationId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data ?? null,
        read: false,
      })
      .returning();
    return notification;
  }

  async markAsRead(id: string, userId: string) {
    const [notification] = await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return notification;
  }

  async markAllAsRead(userId: string) {
    await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return { success: true };
  }
}