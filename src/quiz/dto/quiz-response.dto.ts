// quiz/dto/quiz-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponseDto } from '../../question/dto/question-response.dto';

export class QuizResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  lesson_id: string;

  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
