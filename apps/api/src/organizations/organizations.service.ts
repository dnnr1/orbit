import { Injectable, ConflictException } from '@nestjs/common';
import { db } from '@orbit/db';
import { organizations, users } from '@orbit/db';
import { eq } from 'drizzle-orm';
import { generateId, generateSlug } from '@orbit/shared';
import { CreateOrganization, UpdateOrganization } from '@orbit/shared';

@Injectable()
export class OrganizationsService {
  async findAll() {
    return db.query.organizations.findMany({
      orderBy: (orgs, { desc }) => [desc(orgs.createdAt)],
    });
  }

  async findById(id: string) {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });
    return org;
  }

  async create(data: CreateOrganization) {
    const existing = await db.query.organizations.findFirst({
      where: eq(organizations.slug, data.slug),
    });

    if (existing) {
      throw new ConflictException('Organization slug already exists');
    }

    const [org] = await db
      .insert(organizations)
      .values({
        id: generateId(),
        name: data.name,
        slug: data.slug,
      })
      .returning();

    return org;
  }

  async update(id: string, data: UpdateOrganization) {
    const [org] = await db
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();

    return org;
  }
}