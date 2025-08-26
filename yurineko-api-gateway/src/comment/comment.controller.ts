import { Controller, Get, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles, RolesGuard, UserRole } from 'src/auth';
import { FindByNameUserData } from 'src/user/user.pb';
import { UserService } from 'src/user/user.service';
import { CommentService } from './comment.service';

@Controller({ version: '1', path: 'comment' })
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService
  ) { }

  @Get('mention-search-ahead')
  @ApiOperation({ summary: 'Tìm kiếm user cho mention' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  async mentionSearchAhead(@Query('q') query: string): Promise<FindByNameUserData[]> {
    const response = await this.userService.findByName(query);
    return response;
  }
}
