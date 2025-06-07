import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async create(createModuleDto: {
    title: string;
    description?: string;
    course_id: string;
  }): Promise<Module> {
    const module = this.moduleRepository.create(createModuleDto);
    return await this.moduleRepository.save(module);
  }

  async findAll(): Promise<Module[]> {
    return await this.moduleRepository.find({
      relations: ['course', 'lessons'],
    });
  }

  async findOne(id: string): Promise<Module> {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['course', 'lessons'],
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async findByCourse(courseId: string): Promise<Module[]> {
    return await this.moduleRepository.find({
      where: { course_id: courseId },
      relations: ['lessons'],
    });
  }

  async update(
    id: string,
    updateModuleDto: { title?: string; description?: string },
  ): Promise<Module> {
    const module = await this.findOne(id);
    Object.assign(module, updateModuleDto);
    return await this.moduleRepository.save(module);
  }

  async remove(id: string): Promise<void> {
    const result = await this.moduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
  }
}
