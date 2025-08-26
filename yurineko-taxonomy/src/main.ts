import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { protobufPackage } from './taxonomy/taxonomy.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const httpPort = configService.get<number>('TAXONOMY_SERVICE_PORT') || 50059;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${httpPort}`,
      package: protobufPackage,
      protoPath: join('node_modules/yurineko-microservice-proto/proto/taxonomy.proto')
    }
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);

  // process.send('ready');
}
bootstrap();
