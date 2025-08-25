import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { EnrollmentService } from '../providers/enrollment.service';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  async enroll(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.enroll(dto);
  }

  @Get('user/:userId')
  async getUserEnrollments(@Param('userId') userId: string) {
    return this.enrollmentService.getUserEnrollments(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.enrollmentService.removeEnrollment(id);
  }
}
