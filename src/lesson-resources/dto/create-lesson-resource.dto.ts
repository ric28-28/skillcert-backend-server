import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATION_CONSTRAINTS } from '../../common/constants';

export class CreateLessonResourceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(VALIDATION_CONSTRAINTS.LESSON_RESOURCE_TITLE_MAX_LENGTH)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION_CONSTRAINTS.LESSON_RESOURCE_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  lesson_id: string;
}
