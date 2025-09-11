import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateReferenceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl({}, { message: 'file_url must be a valid URL' })
  file_url: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  module_id?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  lesson_id?: string;
}
