import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  course_id: string;
}
