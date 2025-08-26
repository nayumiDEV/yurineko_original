import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  async verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) { 
      // console.error(error);
      /**
       * Often, the error is: Invalid token :)
       * Or expired token :(
       */
    }
  }
}
