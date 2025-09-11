import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentService } from '../providers/enrollment.service';

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
