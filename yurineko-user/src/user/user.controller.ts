import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FindByNameRequestDto } from './dto';
import { FindByIdForAuthRequest, FindByIdForAuthResponse, FindByIdsForMentionRequest, FindByIdsForMentionResponse, FindByNameResponse, UserServiceController, USER_SERVICE_NAME, FindByIdsRequest, FindByIdsResponse, FindByIdResponse, FindByIdRequest } from './user.pb';
import { UserService } from './user.service';

@Controller('user')
export class UserController implements UserServiceController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @GrpcMethod(USER_SERVICE_NAME, 'findByIdsForMention')
  async findByIdsForMention({ mIds }: FindByIdsForMentionRequest): Promise<FindByIdsForMentionResponse> {
    const users = await this.userService.findByIdsForMentions(mIds);
    return {
      status: HttpStatus.OK,
      error: [],
      data: users,
    }
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByIdForAuth')
  async findByIdForAuth({ mId }: FindByIdForAuthRequest): Promise<FindByIdForAuthResponse> {
    const user = await this.userService.findById(mId);

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['User not found'],
        data: undefined,
      };
    }

    this.userService._compute_User(user);

    return {
      status: HttpStatus.OK,
      error: [],
      data: user as any,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByName')
  async findByName({ mName }: FindByNameRequestDto): Promise<FindByNameResponse> {
    const users = await this.userService.findByName(mName);

    this.userService._batchCompute_MinUser(users);

    return {
      status: HttpStatus.OK,
      error: [],
      data: users,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindByIds')
  async findByIds({ mIds }: FindByIdsRequest): Promise<FindByIdsResponse> {
    const users = await this.userService.findByIds(mIds);

    return {
      status: HttpStatus.OK,
      error: [],
      data: users.map((user) => {
        this.userService._compute_UserAvatar(user);
        return user
      }),
    };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindById')
  async findById({ mId }: FindByIdRequest): Promise<FindByIdResponse> {
    const user = await this.userService.findById(mId);

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['User not found'],
        data: undefined,
      };
    }

    this.userService._compute_UserAvatar(user);

    return {
      status: HttpStatus.OK,
      error: [],
      data: user
    };
  }
}