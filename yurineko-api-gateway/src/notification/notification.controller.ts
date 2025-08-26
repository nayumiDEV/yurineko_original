import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUser, Roles, RolesGuard, User, UserRole } from 'src/auth';
import { NotificationService } from './notification.service';

@Controller({ version: '1', path: 'notification' })
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @ApiOperation({ summary: 'Lấy thông báo' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  getNotification(@User() user: AuthUser, @Query('cursor') cursor: string) {
    return this.notificationService.getNotification(user.mId, cursor);
  }

  @Patch('read/:id')
  @ApiOperation({ summary: 'Đánh dấu đã đọc thông báo' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  readNotification(@User() user: AuthUser, @Param('id') notificationId: string) {
    return this.notificationService.readNotification(user.mId, notificationId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Đánh dấu đã đọc tất cả thông báo' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  readAllNotification(@User() user: AuthUser) {
    return this.notificationService.readAllNotification(user.mId);
  }

  @Patch('view')
  @ApiOperation({ summary: 'Đánh dấu đã xem thông báo' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  viewAllNotification(@User() user: AuthUser) {
    return this.notificationService.viewAllNotification(user.mId);
  }
}
