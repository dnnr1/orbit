import { Body, Controller, Get, Param, Post, Patch, UseGuards, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateAvailabilitySchedule, UpdateAvailabilitySchedule } from '@orbit/shared';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrganizationId } from '../common/decorators/org-id.decorator';

@Controller('organizations/:organizationId/rooms/:roomId/schedule')
@UseGuards(JwtGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  async getSchedule(
    @Param('organizationId') organizationId: string,
    @Param('roomId') roomId: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.schedulesService.getSchedule(organizationId, roomId, userOrgId);
  }

  @Post()
  @Roles('super_admin', 'org_admin', 'manager')
  async create(
    @Param('organizationId') organizationId: string,
    @Param('roomId') roomId: string,
    @Body() data: CreateAvailabilitySchedule,
    @OrganizationId() userOrgId: string
  ) {
    return this.schedulesService.create(organizationId, roomId, data, userOrgId);
  }

  @Patch()
  @Roles('super_admin', 'org_admin', 'manager')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('roomId') roomId: string,
    @Body() data: UpdateAvailabilitySchedule,
    @OrganizationId() userOrgId: string
  ) {
    return this.schedulesService.update(organizationId, roomId, data, userOrgId);
  }
}