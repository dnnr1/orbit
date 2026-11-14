import { Body, Controller, Get, Param, Post, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuilding, UpdateBuilding } from '@orbit/shared';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrganizationId } from '../common/decorators/org-id.decorator';

@Controller('organizations/:organizationId/buildings')
@UseGuards(JwtGuard, RolesGuard)
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get()
  async findAll(
    @Param('organizationId') organizationId: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.buildingsService.findAll(organizationId, userOrgId);
  }

  @Get(':id')
  async findById(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.buildingsService.findById(organizationId, id, userOrgId);
  }

  @Post()
  @Roles('super_admin', 'org_admin', 'manager')
  async create(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateBuilding,
    @OrganizationId() userOrgId: string
  ) {
    return this.buildingsService.create(organizationId, data, userOrgId);
  }

  @Patch(':id')
  @Roles('super_admin', 'org_admin', 'manager')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() data: UpdateBuilding,
    @OrganizationId() userOrgId: string
  ) {
    return this.buildingsService.update(organizationId, id, data, userOrgId);
  }

  @Delete(':id')
  @Roles('super_admin', 'org_admin')
  async remove(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.buildingsService.remove(organizationId, id, userOrgId);
  }
}