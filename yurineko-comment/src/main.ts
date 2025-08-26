import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthenticationGuard } from './auth/guards/auth.guard';
import { ExtendsPaginationWithSkipPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://yurineko-v3-manga.vercel.app',
      /(^|^[^:]+:\/\/|[^\.]+\.)yurineko\.moe/,
    ],
  });
  app.enableVersioning();
  app.use(helmet());
  app.useGlobalGuards(new AuthenticationGuard());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalPipes(new ExtendsPaginationWithSkipPipe());
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Yurineko comment service API')
      .setDescription('Comment API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('explorer', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT || 3300);

  // Telling PM2 that the process is ready to receive requests
  // process.send('ready');
}
bootstrap();
