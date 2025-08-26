import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserServiceClient, USER_SERVICE_NAME } from './user.pb';

@Injectable()
export class UserService implements OnModuleInit {
  private svc: UserServiceClient;

  @Inject(USER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit() {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async findByIdsForMention(mIds: number[]) {
    if (mIds.length === 0) return [];
    const { data } = await firstValueFrom(
      this.svc.findByIdsForMention({ mIds }),
    );
    return data || [];
  }
}
