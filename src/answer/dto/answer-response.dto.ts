// answer/dto/answer-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AnswerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  correct: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
