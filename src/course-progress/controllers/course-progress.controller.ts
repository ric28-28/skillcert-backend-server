import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { CourseProgressService } from '../providers/course-progress.service';
import { UpdateProgressDto } from '../dto/update-course-progress.dto';

@Controller('course-progress')
export class CourseProgressController {
  constructor(private readonly progressService: CourseProgressService) {}


  @Post('update')
  async update(@Body() dto: UpdateProgressDto) {
    return this.progressService.updateProgress(dto);
  }

  @Get(':enrollmentId')
  async getProgress(@Param('enrollmentId') enrollmentId: string) {
    return this.progressService.getProgress(enrollmentId);
  }

  @Get(':enrollmentId/completion-rate')
  async getCompletionRate(@Param('enrollmentId') enrollmentId: string) {
    return this.progressService.getCompletionRate(enrollmentId);
  }

@Get('analytics/overview')
async getAnalytics() {
  return this.progressService.getAnalytics();
}

}
