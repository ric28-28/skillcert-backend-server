import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reference } from '../entities/reference.entity';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Reference)
    private referencesRepository: Repository<Reference>,
  ) {}

  async create(createReferenceDto: CreateReferenceDto): Promise<Reference> {
    const reference = this.referencesRepository.create(createReferenceDto);
    return await this.referencesRepository.save(reference);
  }

  async findAll(): Promise<Reference[]> {
    return await this.referencesRepository.find({
      relations: ['module', 'lesson'],
    });
  }

  async findOne(id: string): Promise<Reference> {
    const reference = await this.referencesRepository.findOne({
      where: { id },
      relations: ['module', 'lesson'],
    });

    if (!reference) {
      throw new NotFoundException(`Reference with ID ${id} not found`);
    }

    return reference;
  }

  async findByModule(moduleId: string): Promise<Reference[]> {
    return await this.referencesRepository.find({
      where: { module_id: moduleId },
      relations: ['module', 'lesson'],
    });
  }

  async findByLesson(lessonId: string): Promise<Reference[]> {
    return await this.referencesRepository.find({
      where: { lesson_id: lessonId },
      relations: ['module', 'lesson'],
    });
  }

  async update(id: string, updateReferenceDto: UpdateReferenceDto): Promise<Reference> {
    const reference = await this.findOne(id);
    Object.assign(reference, updateReferenceDto);
    return await this.referencesRepository.save(reference);
  }

  async remove(id: string): Promise<void> {
    const result = await this.referencesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Reference with ID ${id} not found`);
    }
  }
}
