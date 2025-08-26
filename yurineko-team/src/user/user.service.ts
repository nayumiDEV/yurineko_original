import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { USER_SERVICE_NAME, UserServiceClient } from './user.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private svc: UserServiceClient;

  @Inject(USER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async getUserByIds(ids: number[]) {
    if (!ids.length) return [];

    const { data } = await firstValueFrom(this.svc.findByIds({ mIds: ids }));
    return data;
  }

  async findUserById(id: number) {
    const { data } = await firstValueFrom(this.svc.findById({ mId: id }));
    return data;
  }
}
