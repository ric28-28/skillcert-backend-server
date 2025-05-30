import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  title: string;

  @IsString()
  file_url: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsUUID()
  module_id?: string;

  @IsOptional()
  @IsUUID()
  lesson_id?: string;
}
