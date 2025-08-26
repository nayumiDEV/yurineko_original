import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  Patch,
} from '@nestjs/common';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/auth/decorator/get-user.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RolesGuard, UserRole } from 'src/auth/guards/role.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { MangaService } from 'src/manga/manga.service';
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  CreateReactionDto,
  GetChildCommentDto,
  GetRootCommentDto,
} from './dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { GetReactionCountDto } from './dto/get-reaction-count.dto';
import { NotificationBll } from './notification.bll';
import { GetHightlightedCommentDto as GetHighlightedCommentDto } from './dto/get-hightlight-comment.dto';

@Controller({
  path: 'comment',
  version: '1',
})
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly mangaService: MangaService,
    private readonly notificationBll: NotificationBll,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.UPLOADER, UserRole.USER)
  @ApiOperation({
    summary: 'Tạo comment',
    description:
      'chapterId = null nếu comment ở trang manga, parentId = null nếu comment là root comment (hoặc undefined)',
  })
  async create(
    @User() user: JwtPayload,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const mentionUser = this.commentService._compute_MentionedUserIds(
      createCommentDto.content,
    );

    if (createCommentDto.parentId === null) {
      const [newComment, manga] = await Promise.all([
        this.commentService.create(user, { ...createCommentDto, mentionUser }),
        this.mangaService.getMangaById(createCommentDto.mangaId),
      ]);
      await this.notificationBll.sendNewCommentNotification(
        user,
        createCommentDto,
        mentionUser,
        newComment,
      );
      await this.commentService._computeField_Comment(newComment, user, manga);
      return newComment;
    }

    const parent = await this.commentService.findOne(createCommentDto.parentId);

    if (!parent) {
      throw new BadRequestException(
        'Bạn đang truy cập một comment không tồn tại',
      );
    }

    const [newComment, manga] = await Promise.all([
      this.commentService.create(user, {
        ...createCommentDto,
        mangaId: parent.mangaId,
        chapterId: parent.chapterId,
        path: parent.path,
        mentionUser,
      }),
      this.mangaService.getMangaById(parent.mangaId),
    ]);

    await this.notificationBll.sendNewCommentNotification(
      user,
      createCommentDto,
      mentionUser,
      newComment,
    );
    await this.commentService._computeField_Comment(newComment, user, manga);

    return newComment;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit comment' })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN)
  async editComment(
    @Param('id') id: string,
    @User() user: JwtPayload,
    @Body() body: EditCommentDto,
  ) {
    const comment = await this.commentService.findOne(+id);
    if (!comment) {
      throw new BadRequestException('Comment không tồn tại');
    }

    if (comment.userId !== user.id) {
      throw new UnauthorizedException(
        'Bạn không có quyền chỉnh sửa comment này',
      );
    }

    const editedComment = await this.commentService.edit(user, +id, body);
    await this.commentService._computeField_Comment(
      editedComment,
      user,
      comment.manga,
    );
    return editedComment;
  }

  @Post(':id/reaction')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/unlike comment' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.UPLOADER, UserRole.USER)
  @HttpCode(204)
  async toggleCommentReaction(
    @Param('id') id: string,
    @User() user: JwtPayload,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    const comment = await this.commentService.findOne(+id);
    if (!comment) {
      throw new BadRequestException('Comment không tồn tại');
    }
    try {
      const reactioned = await this.commentService.toggleCommentReaction(
        user,
        +id,
        createReactionDto,
      );
      if (reactioned) {
        await this.notificationBll.sendReactionNotification(
          user,
          +id,
          createReactionDto.type,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get comment cha',
    description: 'chapterId = null nếu ở trang manga (hoặc undefined)',
  })
  async findRootComment(
    @Query() query: GetRootCommentDto,
    @User() user: JwtPayload,
  ) {
    const manga = await this.mangaService.getMangaById(query.mangaId);

    let showDeleted = false;

    if (
      user.role === UserRole.ADMIN ||
      (user.role === UserRole.UPLOADER &&
        manga.mangaTeam.some((team) => team.teamId === user.teamId))
    ) {
      showDeleted = true;
    }

    const [comments, total] = await this.commentService.findRoot(
      query,
      user,
      showDeleted,
    );

    await this.commentService._batchComputeField_Comment(comments, user, manga);

    return {
      results: comments,
      resultCount: total,
    };
  }

  @Get('highlight')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.UPLOADER, UserRole.USER)
  @ApiOperation({ summary: 'Get comment được highlight' })
  async findHighlightComment(
    @Query() query: GetHighlightedCommentDto,
    @User() user: JwtPayload,
  ) {
    const highlightedComment = await this.commentService.findHighlightedComment(
      query,
      user,
    );
    const manga = await this.mangaService.getMangaById(
      highlightedComment[0].mangaId,
    );

    await this.commentService._batchComputeField_Comment(
      highlightedComment,
      user,
      manga,
    );
    return highlightedComment;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comment con' })
  async findChildComment(
    @Param('id') id: string,
    @Query() query: GetChildCommentDto,
    @User() user: JwtPayload,
  ) {
    const comment = await this.commentService.findOne(+id);
    let showDeleted = false;

    if (
      user.role === UserRole.ADMIN ||
      (user.role === UserRole.UPLOADER &&
        comment.manga.mangaTeam.some((team) => team.teamId === user.teamId))
    ) {
      showDeleted = true;
    }

    const children = await this.commentService.findChild(
      +id,
      query,
      user,
      showDeleted,
    );

    let manga: { id: number; mangaTeam: { teamId: number }[] };
    if (children.length > 0) {
      manga = await this.mangaService.getMangaById(children[0].mangaId);
    }

    await this.commentService._batchComputeField_Comment(children, user, manga);

    return {
      results: children,
    };
  }

  @Get(':id/edit-history')
  @ApiOperation({ summary: 'Get lịch sử chỉnh sửa comment' })
  async getEditHistory(@Param('id') id: string) {
    const history = await this.commentService.getModificationHistory(+id);
    await this.commentService._batchComputeField_CommentHistory(history);
    return history;
  }

  @Get(':id/reaction-count')
  @ApiOperation({ summary: 'Get số lượng reaction của comment' })
  async getReactionDetail(
    @Param('id') id: number,
    @Query() query: GetReactionCountDto,
  ) {
    const reactions = await this.commentService.getCommentReactionDetail(
      +id,
      query,
    );

    this.commentService._batchComputeField_CommentReaction(reactions);

    return {
      listUser: reactions,
    };
  }

  @Patch(':id/pin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pin comment' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.UPLOADER)
  @HttpCode(204)
  async pinComment(@Param('id') id: string, @User() user: JwtPayload) {
    await this.commentService.pinComment(+id, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.UPLOADER, UserRole.USER)
  @ApiOperation({
    summary: 'Xóa comment',
    description:
      'Nếu là admin/uploader trong truyện thì hardDelete, không thì softDelete',
  })
  @HttpCode(204)
  async remove(@Param('id') id: string, @User() user: JwtPayload) {
    const comment = await this.commentService.findOne(+id);
    if (!comment) {
      throw new BadRequestException('Comment không tồn tại');
    }

    if (
      user.role === UserRole.ADMIN ||
      (user.role === UserRole.UPLOADER &&
        comment.manga.mangaTeam.some((team) => team.teamId === user.teamId))
    ) {
      await this.commentService.hardRemove(+id);
    } else if (comment.userId === user.id) {
      if (comment.isHidden === true) {
        throw new BadRequestException('Comment không tồn tại');
      }

      await this.commentService.softRemove(+id);
    } else {
      throw new UnauthorizedException('Bạn không có quyền xóa comment này');
    }
  }
}
