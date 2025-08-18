import { IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  title: string;

  @IsUrl({}, { message: 'file_url must be a valid URL' })
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
