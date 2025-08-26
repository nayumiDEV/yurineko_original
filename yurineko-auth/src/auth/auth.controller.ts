import { Controller } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthServiceController, AUTH_SERVICE_NAME, ValidateResponse } from './auth.pb';
import { AuthService } from './auth.service';
import { VaidateRequestDto } from './dto';

@Controller('auth')
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  async validate({ token }: VaidateRequestDto): Promise<ValidateResponse> {
    const decoded = await this.authService.verify(token);

    if (!decoded) {
      return { status: HttpStatus.UNAUTHORIZED, error: ['Token is invalid'], data: { mUserId: null } };
    }

    return {
      status: HttpStatus.OK,
      error: null,
      data: {
        mUserId: decoded.id
      }
    }
  }
}
