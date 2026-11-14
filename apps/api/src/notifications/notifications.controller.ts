import { Controller, Get, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('organizations/:organizationId/notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Param('organizationId') organizationId: string,
    @CurrentUser() user: { id: string },
    @Query('unreadOnly') unreadOnly?: string
  ) {
    return this.notificationsService.findAll(user.id, unreadOnly === 'true');
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { id: string }
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  async markAllAsRead(
    @CurrentUser() user: { id: string }
  ) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}