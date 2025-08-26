import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNullable } from 'src/decorators';

export enum EditCommentStatus {
  HAVE_ATTACHMENT = 'HAVE_ATTACHMENT',
  ATTACHMENT_DELETED = 'ATTACHMENT_DELETED',
  ATTACHMENT_CHANGED = 'ATTACHMENT_CHANGED',
  ATTACHMENT_ADDED = 'ATTACHMENT_ADDED',
}

export class EditCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNullable()
  image: string | null;
}
