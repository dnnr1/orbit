import { Body, Controller, Get, Param, Post, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoom, UpdateRoom } from '@orbit/shared';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrganizationId } from '../common/decorators/org-id.decorator';

@Controller('organizations/:organizationId/rooms')
@UseGuards(JwtGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(
    @Param('organizationId') organizationId: string,
    @OrganizationId() userOrgId: string,
    @Query('buildingId') buildingId?: string
  ) {
    return this.roomsService.findAll(organizationId, userOrgId, buildingId);
  }

  @Get(':id')
  async findById(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.roomsService.findById(organizationId, id, userOrgId);
  }

  @Post()
  @Roles('super_admin', 'org_admin', 'manager')
  async create(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateRoom,
    @Query('buildingId') buildingId: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.roomsService.create(organizationId, buildingId, data, userOrgId);
  }

  @Patch(':id')
  @Roles('super_admin', 'org_admin', 'manager')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() data: UpdateRoom,
    @OrganizationId() userOrgId: string
  ) {
    return this.roomsService.update(organizationId, id, data, userOrgId);
  }

  @Delete(':id')
  @Roles('super_admin', 'org_admin')
  async remove(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @OrganizationId() userOrgId: string
  ) {
    return this.roomsService.remove(organizationId, id, userOrgId);
  }
}