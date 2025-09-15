// question/dto/question-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AnswerResponseDto } from '../../answer/dto/answer-response.dto';

export class QuestionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ type: [AnswerResponseDto] })
  answers: AnswerResponseDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
