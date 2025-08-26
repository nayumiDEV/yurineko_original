import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { PushService } from './push.service';
import { AddPushEndpointRequest, AddPushEndpointResponse, PUSH_SERVICE_NAME, PushServiceController } from './push.pb';
import { PushPayload } from './dto';

@Controller()
export class PushController implements PushServiceController {
  constructor(private readonly pushService: PushService) { }

  @GrpcMethod(PUSH_SERVICE_NAME, 'AddPushEndpoint')
  async addPushEndpoint(request: AddPushEndpointRequest): Promise<AddPushEndpointResponse> {
    await this.pushService.addPushEndpoint(request.mUserId, request.mData);

    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @MessagePattern({ cmd: 'web-push-notification' })
  async push(@Payload() payload: PushPayload) {
    const pushEndpoint = await this.pushService.getPushEndpoint(payload.mUserId);

    if (!pushEndpoint) {
      return;
    }

    const validEndpoint = [];

    for (const subscription of pushEndpoint.mData) {
      try {
        await this.pushService.push(subscription, payload.data);
        validEndpoint.push(subscription);
      } catch (error) {
        console.error(error);
      }
    }

    if (validEndpoint.length !== pushEndpoint.mData.length) {
      await this.pushService.editPushEndpoint(payload.mUserId, validEndpoint);
    }
  }
}
