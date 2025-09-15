import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
