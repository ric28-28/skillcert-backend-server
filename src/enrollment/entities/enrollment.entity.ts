import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity'
import { CourseProgress } from '../../course-progress/entities/course-progress.entity';

@Entity('enrollments')
@Unique(['user', 'course'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
  course: Course;

@OneToMany(() => CourseProgress, (progress) => progress.enrollment)
progress: CourseProgress[];


  @CreateDateColumn()
  enrolledAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
