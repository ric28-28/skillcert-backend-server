import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionResponseDto {
  @IsNotEmpty()
  @IsUUID()
  question_id: string;

  @IsOptional()
  @IsUUID()
  selected_answer_id?: string;

  @IsOptional()
  @IsString()
  text_response?: string;
}

export class SubmitQuizDto {
  @IsNotEmpty()
  @IsUUID()
  quiz_id: string;

  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto)
  responses: QuestionResponseDto[];
}
