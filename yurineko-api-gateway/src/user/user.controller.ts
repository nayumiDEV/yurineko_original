import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger/dist';
import { Observable } from 'rxjs';
import { AuthUser, User } from 'src/auth';
import { FindByNameRequest, FindByNameResponse } from './user.pb';

@Controller({ version: '1', path: 'user' })
export class UserController {
}
