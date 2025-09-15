// modules/dto/module-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { LessonResponseDto } from '../../lessons/dto/lesson-response.dto';

export class ModuleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: [LessonResponseDto], required: false })
  lessons?: LessonResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
