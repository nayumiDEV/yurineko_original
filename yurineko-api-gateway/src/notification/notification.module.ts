import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './notification.controller';
import { NOTIFICATION_PACKAGE_NAME, NOTIFICATION_SERVICE_NAME } from './notification.pb';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ClientsModule.register([{
      name: NOTIFICATION_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50055',
        package: NOTIFICATION_PACKAGE_NAME,
        protoPath: 'node_modules/yurineko-microservice-proto/proto/notification.proto',
      }
    }])
  ],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule { }
