import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './auth';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://yurineko-v3-manga.vercel.app',
      /(^|^[^:]+:\/\/|[^\.]+\.)yurineko\.moe/
    ]
  });
  app.enableVersioning();
  app.use(helmet());
  const authService = app.get(AuthService);
  const userService = app.get(UserService);
  app.useGlobalGuards(new AuthGuard({ authService, userService }));
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Yurineko API Gateway')
      .setDescription('API Gateway for Yurineko')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('explorer', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      }
    });
  }
  await app.listen(process.env.PORT || 50050);

  // process.send('ready');
}
bootstrap();
