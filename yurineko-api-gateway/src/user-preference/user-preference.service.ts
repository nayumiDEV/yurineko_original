import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserPreference, UserPreferenceServiceClient, USER_PREFERENCE_SERVICE_NAME } from './user-preference.pb';

@Injectable()
export class UserPreferenceService implements OnModuleInit {
  private svc: UserPreferenceServiceClient;

  @Inject(USER_PREFERENCE_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.svc = this.client.getService<UserPreferenceServiceClient>(USER_PREFERENCE_SERVICE_NAME);
  }

  public async initUserPreference(userId: number) {
    return this.svc.initUserPreference({ mUserId: userId });
  }

  public async getUserPreference(userId: number) {
    const response = await firstValueFrom(this.svc.getUserPreference({ mUserId: userId }));
    return response.data;
  }

  public async setUserPreference(userId: number, data: UserPreference) {
    return this.svc.setUserPreference({ mUserId: userId, mUserReference: data });
  }
}
