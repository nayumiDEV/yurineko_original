import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PUSH_NOTIFICATION_SERVICE } from './push.definition';
import { PushService } from './push.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PUSH_NOTIFICATION_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.PUSH_NOTIFICATION_QUEUE_NAME,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [PushService],
  providers: [PushService],
})
export class PushModule {}
