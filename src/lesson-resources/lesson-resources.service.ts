import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LOCAL_FILE_STORAGE_SERVICE } from 'src/storage/constants';
import { Repository } from 'typeorm';
import {
  LessonResource,
  ResourceType,
} from '../entities/lesson-resource.entity';
import { FileStorageInterface } from '../storage/interfaces/file-storage.interface';
import { LESSON_RESOURCES_PATH } from './constants';
import { CreateLessonResourceDto } from './dto/create-lesson-resource.dto';
import { UpdateLessonResourceDto } from './dto/update-lesson-resource.dto';

@Injectable()
export class LessonResourcesService {
  constructor(
    @InjectRepository(LessonResource)
    private readonly lessonResourceRepository: Repository<LessonResource>,
    @Inject(LOCAL_FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageInterface,
  ) {}

  async create(
    file: Express.Multer.File,
    fileUploadDto: CreateLessonResourceDto,
  ): Promise<LessonResource> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Upload file using storage service
      const uploadResult = await this.fileStorageService.uploadFile(
        file,
        LESSON_RESOURCES_PATH,
      );

      // Determine resource type based on mimetype
      const resourceType = this.getResourceTypeFromMimetype(file.mimetype);

      // Create lesson resource record
      const lessonResource = this.lessonResourceRepository.create({
        title: fileUploadDto.title,
        description: fileUploadDto.description,
        filename: uploadResult.filename,
        original_name: uploadResult.originalName,
        mimetype: uploadResult.mimetype,
        size: uploadResult.size,
        file_path: uploadResult.path,
        file_url: uploadResult.url,
        resource_type: resourceType,
        lesson_id: fileUploadDto.lesson_id,
      });

      return await this.lessonResourceRepository.save(lessonResource);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error';

      throw new BadRequestException(`Resource creation failed: ${msg}`);
    }
  }

  async findAll(): Promise<LessonResource[]> {
    return await this.lessonResourceRepository.find({
      relations: ['lesson'],
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LessonResource> {
    const lessonResource = await this.lessonResourceRepository.findOne({
      where: { id, is_active: true },
      relations: ['lesson'],
    });

    if (!lessonResource) {
      throw new NotFoundException(`Lesson resource with ID ${id} not found`);
    }

    return lessonResource;
  }

  async findByLesson(lessonId: string): Promise<LessonResource[]> {
    return await this.lessonResourceRepository.find({
      where: { lesson_id: lessonId, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findByResourceType(
    resourceType: ResourceType,
  ): Promise<LessonResource[]> {
    return await this.lessonResourceRepository.find({
      where: { resource_type: resourceType, is_active: true },
      relations: ['lesson'],
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: string,
    updateLessonResourceDto: UpdateLessonResourceDto,
  ): Promise<LessonResource> {
    const lessonResource = await this.findOne(id);

    Object.assign(lessonResource, updateLessonResourceDto);
    return await this.lessonResourceRepository.save(lessonResource);
  }

  async softDelete(id: string): Promise<void> {
    // Soft delete by setting is_active to false
    await this.lessonResourceRepository.update(id, { is_active: false });
  }

  async permanentDelete(id: string): Promise<void> {
    const lessonResource = await this.findOne(id);

    try {
      // Delete file from storage
      await this.fileStorageService.deleteFile(
        lessonResource.filename,
        LESSON_RESOURCES_PATH,
      );
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error';

      console.error(`Failed to delete file: ${msg}`);
    }

    // Permanently delete the record
    await this.lessonResourceRepository.delete(id);
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.lessonResourceRepository.increment({ id }, 'download_count', 1);
  }

  private getResourceTypeFromMimetype(mimetype: string): ResourceType {
    if (mimetype.startsWith('image/')) return ResourceType.IMAGE;
    if (mimetype.startsWith('video/')) return ResourceType.VIDEO;
    if (mimetype.startsWith('audio/')) return ResourceType.AUDIO;
    if (
      mimetype.includes('pdf') ||
      mimetype.includes('document') ||
      mimetype.includes('text') ||
      mimetype.includes('spreadsheet') ||
      mimetype.includes('presentation')
    ) {
      return ResourceType.DOCUMENT;
    }
    if (mimetype.includes('zip') || mimetype.includes('rar')) {
      return ResourceType.ARCHIVE;
    }
    return ResourceType.OTHER;
  }
}
