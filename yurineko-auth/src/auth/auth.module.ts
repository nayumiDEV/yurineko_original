import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        // publicKey: readFileSync(configService.getOrThrow('PUBLIC_KEY_PATH')),
        // privateKey: readFileSync(configService.getOrThrow('PRIVATE_KEY_PATH')),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: configService.getOrThrow('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
