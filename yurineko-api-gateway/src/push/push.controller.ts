import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PushService } from './push.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUser, Roles, RolesGuard, User, UserRole } from 'src/auth';
import { AddPushEndpointDto } from './dto';

@Controller({ version: '1', path: 'push' })
export class PushController {
  constructor(private readonly pushService: PushService) { }

  @Post("/endpoint")
  @ApiOperation({ summary: "Thêm web push notification endpoint" })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  async addPushEndpoint(@User() user: AuthUser, @Body() payload: AddPushEndpointDto) {
    return this.pushService.addPushEndpoint({
      mUserId: user.mId,
      mData: payload.mData
    });
  }
}
