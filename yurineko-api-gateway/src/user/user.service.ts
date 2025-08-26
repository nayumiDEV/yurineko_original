import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthUserData, FindByNameUserData, UserServiceClient, USER_SERVICE_NAME } from './user.pb';

@Injectable()
export class UserService implements OnModuleInit {
  private svc: UserServiceClient;

  @Inject(USER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async findUserByIdForAuth(id: number): Promise<AuthUserData> {
    const response = await firstValueFrom(this.svc.findByIdForAuth({ mId: id }));
    return response.data;
  }

  public async findByName(query: string): Promise<FindByNameUserData[]> {
    const response = await firstValueFrom(this.svc.findByName({ mName: query }));
    return response.data || [];
  }
}
