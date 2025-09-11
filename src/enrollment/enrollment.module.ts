import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { EnrollmentController } from './controllers/enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentService } from './providers/enrollment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Course])],
  providers: [EnrollmentService],
  controllers: [EnrollmentController],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
