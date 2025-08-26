import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common';
import { protobufPackage } from './notification/notification.pb';
import { UserPreferenceService } from './user-preference/user-preference.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // needed this to trigger OnModuleInit
  await app.init();

  const configService = app.get(ConfigService);

  const microserviceGrpc: INestMicroservice =
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50055',
        package: protobufPackage,
        protoPath: join(
          'node_modules/yurineko-microservice-proto/proto/notification.proto',
        ),
      },
    });

  const rabbitMQUrl = configService.getOrThrow('RABBITMQ_URL');
  const rabbitMQQueueName = configService.getOrThrow('RABBITMQ_QUEUE_NAME');

  const microserviceRabbitMq: INestMicroservice =
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMQUrl],
        queue: rabbitMQQueueName,
        queueOptions: {
          durable: true,
        },
      },
    });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();

  process.send('ready');
}
bootstrap();
