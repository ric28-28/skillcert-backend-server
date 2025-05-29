import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reference } from './reference.entity';
import { Lesson } from './lesson.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Reference, (reference) => reference.module)
  references: Reference[];

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
