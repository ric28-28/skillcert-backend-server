import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProgressStatus } from '../entities/course-progress.entity';

export class UpdateProgressDto {
  @IsString()
  @IsNotEmpty()
  enrollmentId: string;

  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @IsEnum(ProgressStatus)
  status: ProgressStatus;
}
