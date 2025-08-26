import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseProgress } from './entities/course-progress.entity';
import { CourseProgressService } from './providers/course-progress.service';
import { CourseProgressController } from './controllers/course-progress.controller';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseProgress, Enrollment, Lesson])],
  providers: [CourseProgressService],
  controllers: [CourseProgressController],
  exports: [CourseProgressService],
})
export class CourseProgressModule {}
