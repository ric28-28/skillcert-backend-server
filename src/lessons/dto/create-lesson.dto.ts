import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { LessonType } from '../entities/lesson.entity';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;

  @IsUUID()
  module_id: string;
}