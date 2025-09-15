// lessons/dto/lesson-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export enum LessonType {
  TEXT = 'text',
  VIDEO = 'video',
  QUIZ = 'quiz',
}

export class LessonResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ enum: LessonType, default: LessonType.TEXT })
  type: LessonType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
