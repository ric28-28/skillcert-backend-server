import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  professorId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string;
}
