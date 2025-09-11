import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  professorId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string;
}
