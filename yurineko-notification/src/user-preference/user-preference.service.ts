import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  UserPreferenceServiceClient,
  USER_PREFERENCE_SERVICE_NAME,
} from './user-preference.pb';

@Injectable()
export class UserPreferenceService implements OnModuleInit {
  private svc: UserPreferenceServiceClient;

  @Inject(USER_PREFERENCE_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.svc = this.client.getService<UserPreferenceServiceClient>(
      USER_PREFERENCE_SERVICE_NAME,
    );
  }

  public async getPreferences(userIds: number[]) {
    const response = await firstValueFrom(
      this.svc.batchGetUserPreference({ mUserIds: userIds }),
    );

    return response.data;
  }
}
