import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUser, Roles, RolesGuard, User, UserRole } from 'src/auth';
import { CreateSignedUrlRequest } from './storage.pb';

@Controller({ version: '1', path: 'storage' })
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post("/signed-url")
  @ApiOperation({ summary: "Lấy url upload" })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  async createSignedUrl(@Body() payload: CreateSignedUrlRequest) {
    return this.storageService.createSignedUrl(payload);
  }
}
