import { Body, Controller, Get, Param, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganization, UpdateOrganization } from '@orbit/shared';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('organizations')
@UseGuards(JwtGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Post()
  @Roles('super_admin')
  async create(@Body() data: CreateOrganization) {
    return this.organizationsService.create(data);
  }

  @Patch(':id')
  @Roles('super_admin', 'org_admin')
  async update(@Param('id') id: string, @Body() data: UpdateOrganization) {
    return this.organizationsService.update(id, data);
  }
}