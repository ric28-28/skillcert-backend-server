import { IsString, IsOptional, IsUUID, IsEnum, IsNotEmpty } from 'class-validator';
import { LessonType } from '../entities/lesson.entity';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(LessonType)
  type?: LessonType;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  module_id: string;
}