import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthUser, User } from 'src/auth';
import { UserPreference } from './user-preference.pb';
import { UserPreferenceService } from './user-preference.service';

@Controller({ version: '1', path: 'user-preference' })
export class UserPreferenceController {
  constructor(private readonly userPreferenceService: UserPreferenceService) { }

  @Post(':id')
  initUserPreference(@Param('id') id: number) {
    return this.userPreferenceService.initUserPreference(id);
  }

  @Get()
  getUserPreference(@User() user: AuthUser) {
    return this.userPreferenceService.getUserPreference(user.mId);
  }

  @Patch()
  setUserPreference(@User() user: AuthUser, @Body() payload: UserPreference) {
    return this.userPreferenceService.setUserPreference(user.mId, payload);
  }
}
