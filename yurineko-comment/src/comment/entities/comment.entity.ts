import { ApiProperty } from '@nestjs/swagger';
import { Comment as PrismaComment } from '@prisma/client';

export class Comment implements PrismaComment {
  mentionUser: string;
  @ApiProperty()
  isEdited: boolean;
  @ApiProperty()
  id: number;
  @ApiProperty()
  mangaId: number;
  @ApiProperty()
  chapterId: number;
  @ApiProperty()
  path: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  parentId: number;
  @ApiProperty()
  isHidden: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  image: string;
  @ApiProperty()
  likeCount: number;
  @ApiProperty()
  pinCreator: number;
  @ApiProperty()
  pinCreateAt: Date;
  @ApiProperty()
  replyCount: number;
}
