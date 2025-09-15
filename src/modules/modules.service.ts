import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module as ModuleEntity } from './entities/module.entity';
import { ModuleResponseDto } from './dto/module-response.dto';
import { LessonResponseDto } from '../lessons/dto/lesson-response.dto';
import { Module } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
  ) {}

  private toResponseDto(module: ModuleEntity): ModuleResponseDto {
    return {
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: module.lessons
        ? module.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            type: lesson.type,
            createdAt: lesson.created_at,
            updatedAt: lesson.updated_at,
          } as LessonResponseDto))
        : [],
      createdAt: module.created_at,
      updatedAt: module.updated_at,
    };
  }

  async create(createModuleDto: CreateModuleDto): Promise<ModuleResponseDto> {
    const module = this.moduleRepository.create(createModuleDto);
    const saved = await this.moduleRepository.save(module);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<ModuleResponseDto[]> {
    const modules = await this.moduleRepository.find({
      relations: ['course', 'lessons'],
    });
    return modules.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<ModuleResponseDto> {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['course', 'lessons'],
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return this.toResponseDto(module);
  }

  async findByCourseId(courseId: string): Promise<ModuleResponseDto[]> {
    const modules = await this.moduleRepository.find({
      where: { course_id: courseId },
      relations: ['lessons'],
      order: { created_at: 'ASC' },
    });

    return modules.map(this.toResponseDto);
  }

  async update(id: string, updateModuleDto: UpdateModuleDto): Promise<ModuleResponseDto> {
    const module = await this.findOne(id);
    Object.assign(module, updateModuleDto);
    const updated = await this.moduleRepository.save(module as any);
    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const module = await this.moduleRepository.findOne({ where: { id } });
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    await this.moduleRepository.remove(module);
  }
}
