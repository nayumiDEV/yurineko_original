import { CACHE_MANAGER, Controller, HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcMethod } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { SetUserPreferenceDto } from './dto';
import { UserPreference } from './schemas';
import { BatchGetUserPreferenceRequest, BatchGetUserPreferenceResponse, GetUserPreferenceRequest, GetUserPreferenceResponse, InitUserPreferenceRequest, InitUserPreferenceResponse, SetUserPreferenceRequest, SetUserPreferenceResponse, UserPreferenceServiceController, USER_PREFERENCE_SERVICE_NAME } from './user-preference.pb';
import { UserPreferenceService } from './user-preference.service';

@Controller('user-preference')
export class UserPreferenceController implements UserPreferenceServiceController {
  constructor(
    private readonly userPreferenceService: UserPreferenceService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly configService: ConfigService,
  ) { }

  @GrpcMethod(USER_PREFERENCE_SERVICE_NAME, 'InitUserPreference')
  async initUserPreference(request: InitUserPreferenceRequest): Promise<InitUserPreferenceResponse> {
    await this.userPreferenceService.initUserPreference(request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    }
  }

  @GrpcMethod(USER_PREFERENCE_SERVICE_NAME, 'BatchGetUserPreference')
  async batchGetUserPreference(request: BatchGetUserPreferenceRequest): Promise<BatchGetUserPreferenceResponse> {
    const data: UserPreference[] = [];
    const uncachedUserIds: number[] = [];
    for (const userId of request.mUserIds) {
      const cachedUserPreference = await this.cacheService.get<UserPreference>(`user_preference:${userId}`);
      if (cachedUserPreference) {
        data[userId] = cachedUserPreference;
      } else {
        uncachedUserIds.push(userId);
      }
    }

    (await this.userPreferenceService.batchGetUserPreference(uncachedUserIds)).forEach((userPreference) => {
      data[userPreference.mUserId] = userPreference;
    });

    await Promise.all(
      data.map(
        userPreference =>
          this.cacheService.set(`user_preference:${userPreference.mUserId}`, userPreference)
      )
    );

    return {
      status: HttpStatus.OK,
      error: [],
      data,
    }
  }

  @GrpcMethod(USER_PREFERENCE_SERVICE_NAME, 'GetUserPreference')
  async getUserPreference(request: GetUserPreferenceRequest): Promise<GetUserPreferenceResponse> {
    const cachedUserPreference = await this.cacheService.get<UserPreference>(`user_preference:${request.mUserId}`);

    if (cachedUserPreference) {
      return {
        status: HttpStatus.OK,
        error: [],
        data: cachedUserPreference,
      };
    }

    let data = await this.userPreferenceService.getUserPreference(request.mUserId);

    if (!data) {
      data = await this.userPreferenceService.initUserPreference(request.mUserId);
    }

    await this.cacheService.set(`user_preference:${request.mUserId}`, data, parseInt(this.configService.getOrThrow('CACHE_TTL')));

    return {
      status: HttpStatus.OK,
      error: [],
      data,
    };
  }

  @GrpcMethod(USER_PREFERENCE_SERVICE_NAME, 'SetUserPreference')
  async setUserPreference(request: SetUserPreferenceDto): Promise<SetUserPreferenceResponse> {
    await this.userPreferenceService.setUserPreference(request.mUserId, request.mUserReference);
    await this.cacheService.del(`user_preference:${request.mUserId}`);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }
}
