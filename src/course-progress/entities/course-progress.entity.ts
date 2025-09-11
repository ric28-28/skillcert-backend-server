import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('course_progress')
@Unique(['enrollment', 'lesson']) // prevent duplicates
export class CourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.progress, {
    onDelete: 'CASCADE',
  })
  enrollment: Enrollment;

  @ManyToOne(() => Lesson, { eager: true, onDelete: 'CASCADE' })
  lesson: Lesson;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status: ProgressStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
