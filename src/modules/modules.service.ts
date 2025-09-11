import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
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

  async findByCourseId(courseId: string): Promise<Module[]> {
    return await this.moduleRepository.find({
      where: { course_id: courseId },
      relations: ['lessons'],
      order: { created_at: 'ASC' },
    });
  }

  async update(id: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const module = await this.findOne(id);
    Object.assign(module, updateModuleDto);
    return await this.moduleRepository.save(module);
  }

  async remove(id: string): Promise<void> {
    const module = await this.findOne(id);
    await this.moduleRepository.remove(module);
  }
}
