import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonResourceDto } from './create-lesson-resource.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateLessonResourceDto extends PartialType(
  CreateLessonResourceDto,
) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
