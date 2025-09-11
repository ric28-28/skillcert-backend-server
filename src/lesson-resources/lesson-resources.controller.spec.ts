/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LessonResource,
  ResourceType,
} from '../entities/lesson-resource.entity';
import { LessonResourcesController } from './lesson-resources.controller';
import { LessonResourcesService } from './lesson-resources.service';

describe('LessonResourcesController', () => {
  let controller: LessonResourcesController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByLesson: jest.fn(),
    findByResourceType: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    permanentDelete: jest.fn(),
    incrementDownloadCount: jest.fn(),
  };

  const mockLessonResources = [
    {
      id: 'resource-uuid',
      title: 'Test Resource',
      description: 'Test Description',
      filename: 'unique-filename.pdf',
      original_name: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      file_path: '/uploads/lesson-resources/unique-filename.pdf',
      file_url:
        'http://localhost:3000/uploads/lesson-resources/unique-filename.pdf',
      resource_type: ResourceType.DOCUMENT,
      lesson_id: 'lesson-uuid',
    },
    {
      id: 'resource-uuid-2',
      title: 'Test Resource 2',
      description: 'Test Description 2',
      filename: 'unique-filename-2.pdf',
      original_name: 'test-2.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      file_path: '/uploads/lesson-resources/unique-filename-2.pdf',
      file_url:
        'http://localhost:3000/uploads/lesson-resources/unique-filename-2.pdf',
      resource_type: ResourceType.DOCUMENT,
      lesson_id: 'lesson-uuid',
    },
  ] as LessonResource[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonResourcesController],
      providers: [
        {
          provide: LessonResourcesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LessonResourcesController>(
      LessonResourcesController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockFile = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const mockFileUploadDto = {
      title: 'Test Resource',
      description: 'Test Description',
      lesson_id: 'lesson-uuid',
    };

    it('should create lesson resource successfully', async () => {
      mockService.create.mockResolvedValue(mockLessonResources[0]);

      const result = await controller.create(mockFile, mockFileUploadDto);

      expect(mockService.create).toHaveBeenCalledWith(
        mockFile,
        mockFileUploadDto,
      );
      expect(result).toEqual({
        message: 'Lesson resource created successfully',
        data: mockLessonResources[0],
      });
    });

    it('should throw BadRequestException when no file provided', async () => {
      await expect(
        controller.create(undefined as any, mockFileUploadDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all resources when no type filter', async () => {
      mockService.findAll.mockResolvedValue(mockLessonResources);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Lesson resources retrieved successfully',
        data: mockLessonResources,
        count: mockLessonResources.length,
      });
    });

    it('should return resources filtered by type', async () => {
      const documentResources = mockLessonResources;
      mockService.findByResourceType.mockResolvedValue(documentResources);

      const result = await controller.findAll(ResourceType.DOCUMENT);

      expect(mockService.findByResourceType).toHaveBeenCalledWith(
        ResourceType.DOCUMENT,
      );
      expect(result).toEqual({
        message: 'Lesson resources retrieved successfully',
        data: documentResources,
        count: documentResources.length,
      });
    });
  });

  describe('findByLesson', () => {
    it('should return resources for a specific lesson', async () => {
      const mockResources = mockLessonResources;

      mockService.findByLesson.mockResolvedValue(mockResources);

      const result = await controller.findByLesson('lesson-1');

      expect(mockService.findByLesson).toHaveBeenCalledWith('lesson-1');
      expect(result).toEqual({
        message: 'Lesson resources retrieved successfully',
        data: mockResources,
        count: mockResources.length,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single resource', async () => {
      const mockResource = mockLessonResources[0];
      mockService.findOne.mockResolvedValue(mockResource);

      const result = await controller.findOne(mockResource.id);

      expect(mockService.findOne).toHaveBeenCalledWith(mockResource.id);
      expect(result).toEqual({
        message: 'Lesson resource retrieved successfully',
        data: mockResource,
      });
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const updateDto = { title: 'Updated Title' };
      const mockResource = mockLessonResources[0];
      mockService.update.mockResolvedValue(mockResource);

      const result = await controller.update(mockResource.id, updateDto);

      expect(mockService.update).toHaveBeenCalledWith(
        mockResource.id,
        updateDto,
      );
      expect(result).toEqual({
        message: 'Lesson resource updated successfully',
        data: mockResource,
      });
    });
  });

  describe('trackDownload', () => {
    it('should track download', async () => {
      mockService.incrementDownloadCount.mockResolvedValue(undefined);

      const result = await controller.trackDownload(mockLessonResources[0].id);

      expect(mockService.incrementDownloadCount).toHaveBeenCalledWith(
        mockLessonResources[0].id,
      );
      expect(result).toEqual({
        message: 'Download tracked successfully',
      });
    });
  });

  describe('softDelete', () => {
    it('should soft delete a resource', async () => {
      mockService.softDelete.mockResolvedValue(undefined);

      await controller.softDelete(mockLessonResources[0].id);

      expect(mockService.softDelete).toHaveBeenCalledWith(
        mockLessonResources[0].id,
      );
    });
  });

  describe('permanentDelete', () => {
    it('should permanently delete a resource', async () => {
      mockService.permanentDelete.mockResolvedValue(undefined);

      await controller.permanentDelete(mockLessonResources[0].id);

      expect(mockService.permanentDelete).toHaveBeenCalledWith(
        mockLessonResources[0].id,
      );
    });
  });
});
