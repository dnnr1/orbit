import { Body, Controller, Get, Param, Post, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBooking, UpdateBooking, CancelBooking, ApproveBooking, RejectBooking } from '@orbit/shared';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrganizationId } from '../common/decorators/org-id.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('organizations/:organizationId/bookings')
@UseGuards(JwtGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(
    @Param('organizationId') organizationId: string,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string },
    @Query('status') status?: string,
    @Query('roomId') roomId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.bookingsService.findAll(organizationId, userOrgId, user, {
      status,
      roomId,
      from,
      to,
    });
  }

  @Get(':id')
  async findById(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.bookingsService.findById(organizationId, id, userOrgId, user);
  }

  @Post()
  @Roles('super_admin', 'org_admin', 'manager', 'booker')
  async create(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateBooking,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.bookingsService.create(organizationId, data, userOrgId, user);
  }

  @Patch(':id')
  @Roles('super_admin', 'org_admin', 'manager', 'booker')
  async update(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() data: UpdateBooking,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.bookingsService.update(organizationId, id, data, userOrgId, user);
  }

  @Post(':id/cancel')
  @Roles('super_admin', 'org_admin', 'manager', 'booker')
  async cancel(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() data: CancelBooking,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.bookingsService.cancel(organizationId, id, data, userOrgId, user);
  }

  @Post(':id/approve')
  @Roles('super_admin', 'org_admin', 'manager')
  async approve(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() data: ApproveBooking,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.bookingsService.approve(organizationId, id, data, userOrgId, user);
  }

  @Post(':id/reject')
  @Roles('super_admin', 'org_admin', 'manager')
  async reject(
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() data: RejectBooking,
    @OrganizationId() userOrgId: string,
    @CurrentUser() user: { id: string; role: string }
  ) {
    return this.bookingsService.reject(organizationId, id, data, userOrgId, user);
  }
}