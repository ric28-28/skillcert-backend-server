import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/reviews.entity';
import { ReviewsService } from './reviews.service';

// TODO This field ne eds to be removed after the login integration process
const SAMPLE_USER_ID: string = 'DJKF392GKK';

@Controller('courses/:courseId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('courseId') courseId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.createReview(
      SAMPLE_USER_ID,
      courseId,
      createReviewDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Param('courseId') courseId: string): Promise<Review[]> {
    return this.reviewsService.findCourseReviews(courseId);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('courseId') courseId: string): Promise<Review> {
    return this.reviewsService.findCourseMyReview(SAMPLE_USER_ID, courseId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('courseId') courseId: string,
    @Body() updateDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.updateReview(
      SAMPLE_USER_ID,
      courseId,
      updateDto,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@Param('courseId') courseId: string): Promise<void> {
    return this.reviewsService.deleteReview(SAMPLE_USER_ID, courseId);
  }
}
