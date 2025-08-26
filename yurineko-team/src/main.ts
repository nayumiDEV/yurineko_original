import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { GrpcExceptionFilter, PrismaExceptionFilter } from './common';
import { protobufPackage } from './team/team.pb';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.useGlobalFilters(new PrismaExceptionFilter())
  app.useGlobalFilters(new GrpcExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.TEAM_SERVICE_PORT}`,
      package: protobufPackage,
      protoPath: join('node_modules/yurineko-microservice-proto/proto/team.proto'),
    },
  }, {
    inheritAppConfig: true,
  })

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.TEAM_SERVICE_IDENTITY,
      queueOptions: {
        durable: true,
      },
    },
  })

  await app.startAllMicroservices();
  await app.listen(process.env.TEAM_SERVICE_PORT)

  process.send('ready');
}
bootstrap();
