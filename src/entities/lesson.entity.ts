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
import { CourseProgress } from '../course-progress/entities/course-progress.entity';
import { LessonResource } from './lesson-resource.entity';
import { Module } from './module.entity';
import { Reference } from './reference.entity';

export enum LessonType {
  TEXT = 'text',
  VIDEO = 'video',
  QUIZ = 'quiz',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.TEXT,
  })
  type: LessonType;

  @Column({ nullable: true })
  module_id: string;

  @ManyToOne(() => Module, (module) => module.lessons)
  @OneToMany(() => CourseProgress, (progress) => progress.lesson)
  progress: CourseProgress[];

  @JoinColumn({ name: 'module_id' })
  module: Module;

  @OneToMany(() => Reference, (reference) => reference.lesson)
  references: Reference[];

  @OneToMany(() => LessonResource, (resource) => resource.lesson)
  resources: LessonResource[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
