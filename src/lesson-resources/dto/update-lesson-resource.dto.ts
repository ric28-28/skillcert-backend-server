import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateLessonResourceDto } from './create-lesson-resource.dto';

export class UpdateLessonResourceDto extends PartialType(
  CreateLessonResourceDto,
) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
