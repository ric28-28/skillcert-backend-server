import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseProgress, ProgressStatus } from '../entities/course-progress.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { UpdateProgressDto } from '../dto/update-course-progress.dto';

@Injectable()
export class CourseProgressService {
  constructor(
    @InjectRepository(CourseProgress)
    private progressRepo: Repository<CourseProgress>,
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
  ) {}

  async updateProgress(dto: UpdateProgressDto) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id: dto.enrollmentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const lesson = await this.lessonRepo.findOne({ where: { id: dto.lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    let progress = await this.progressRepo.findOne({
      where: { enrollment: { id: dto.enrollmentId }, lesson: { id: dto.lessonId } },
      relations: ['enrollment', 'lesson'],
    });

    if (!progress) {
      progress = this.progressRepo.create({
        enrollment,
        lesson,
        status: dto.status,
      });
    } else {
      progress.status = dto.status;
    }

    return this.progressRepo.save(progress);
  }

  async getProgress(enrollmentId: string) {
    return this.progressRepo.find({
      where: { enrollment: { id: enrollmentId } },
      relations: ['lesson'],
    });
  }

   async getCompletionRate(enrollmentId: string) {
    const total = await this.progressRepo.count({
      where: { enrollment: { id: enrollmentId } },
    });

    if (total === 0) {
      return { completionRate: 0 };
    }

    const completed = await this.progressRepo.count({
      where: { 
        enrollment: { id: enrollmentId },
        status: ProgressStatus.COMPLETED,
      },
    });

    const completionRate = (completed / total) * 100;

    return { 
      enrollmentId,
      completed,
      total,
      completionRate: Math.round(completionRate),
    };
  }

  // course-progress.service.ts
async getAnalytics() {
  const totalProgress = await this.progressRepo.count();
  const completed = await this.progressRepo.count({
    where: { status: ProgressStatus.COMPLETED  },
  });

  return {
    totalProgress,
    completed,
    overallCompletionRate: totalProgress > 0 ? (completed / totalProgress) * 100 : 0,
  };
}


}
