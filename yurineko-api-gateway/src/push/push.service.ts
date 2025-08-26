import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AddPushEndpointRequest, PUSH_SERVICE_NAME, PushServiceClient } from './push.pb';
import { firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class PushService implements OnModuleInit {
  private svc: PushServiceClient;

  @Inject(PUSH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.svc = this.client.getService<PushServiceClient>(PUSH_SERVICE_NAME);
  }

  async addPushEndpoint(payload: AddPushEndpointRequest) {
    await firstValueFrom(this.svc.addPushEndpoint(payload));
  }
}
