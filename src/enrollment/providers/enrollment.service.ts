import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { Enrollment } from '../entities/enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async enroll(dto: CreateEnrollmentDto): Promise<Enrollment> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const course = await this.courseRepo.findOne({
      where: { id: dto.courseId },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!course) throw new NotFoundException('Course not found');

    const enrollment = this.enrollmentRepo.create({ user, course });
    return this.enrollmentRepo.save(enrollment);
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });
  }

  async removeEnrollment(enrollmentId: string): Promise<void> {
    await this.enrollmentRepo.delete(enrollmentId);
  }
}
