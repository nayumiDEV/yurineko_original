import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PushPayload, PUSH_NOTIFICATION_SERVICE } from './push.definition';

@Injectable()
export class PushService {
  @Inject(PUSH_NOTIFICATION_SERVICE) private readonly pushClient: ClientRMQ;

  async sendPushNotification(payload: PushPayload): Promise<void> {
    return firstValueFrom(
      this.pushClient.send(
        { cmd: 'web-push-notification' },
        this.sanitizePayload(payload),
      ),
      { defaultValue: undefined },
    );
  }

  sanitizePayload(payload: PushPayload): PushPayload {
    return {
      ...payload,
      data: {
        ...payload.data,
        title: this.sanitizeHtml(payload.data.title),
        body: this.sanitizeHtml(payload.data.body),
      },
    };
  }

  sanitizeHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }
}
