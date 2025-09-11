import { PartialType } from '@nestjs/mapped-types';
import { CreateObjectiveDto } from './create-objective.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateObjectiveDto extends PartialType(CreateObjectiveDto) {
  @IsOptional()
  @IsUUID('4')
  courseId?: string;
}
