import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentService } from '../providers/enrollment.service';

@Controller('enrollments')
@ApiTags('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @ApiOperation({ summary: 'Enroll user in a course' })
  @ApiResponse({ status: 201, description: 'User enrolled successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Enrollment failed' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async enroll(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.enroll(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user enrollments' })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async getUserEnrollments(@Param('userId') userId: string) {
    return this.enrollmentService.getUserEnrollments(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove enrollment' })
  @ApiResponse({ status: 200, description: 'Enrollment removed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Enrollment not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async remove(@Param('id') id: string) {
    return this.enrollmentService.removeEnrollment(id);
  }
}
