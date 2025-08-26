import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNullable } from 'src/decorators';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  mangaId: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsNullable()
  chapterId: number | null = null;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsNullable()
  parentId: number | null = null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNullable()
  image: string = null;
}
