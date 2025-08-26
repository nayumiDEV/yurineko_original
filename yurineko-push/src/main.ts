import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { INestMicroservice } from '@nestjs/common';
import { HttpExceptionFilter } from './common';
import { protobufPackage } from './push/push.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const configService = app.get(ConfigService);

  const microserviceGRPC: INestMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50056',
      package: protobufPackage,
      protoPath: 'node_modules/yurineko-microservice-proto/proto/push.proto',
    },
  });

  const rabbitMQUrl = configService.getOrThrow('RABBITMQ_URL');
  const rabbitMQQueueName = configService.getOrThrow('RABBITMQ_QUEUE_NAME');

  const microserviceRabbitMq: INestMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: rabbitMQQueueName,
      queueOptions: {
        durable: true
      },
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter())

  await app.startAllMicroservices();

  process.send('ready');
}
bootstrap();
