import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  course_id: string;
}
