import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';
import { Question } from '../../question/entities/question.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  lesson_id: string;

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
