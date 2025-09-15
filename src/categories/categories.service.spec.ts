import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../entities/category.entity';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  const mockCategory: Category = {
    id: 'test-id',
    name: 'Test Category',
    description: 'Test Description',
    color: '#FF0000',
    isActive: true,
    courses: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    nameExists: jest.fn(),
    exists: jest.fn(),
    findActiveCategories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
        color: '#FF0000',
      };

      mockRepository.nameExists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(mockCategory);

      const result = await service.create(createDto);

      expect(repository.nameExists).toHaveBeenCalledWith(createDto.name);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException if name already exists', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      mockRepository.nameExists.mockResolvedValue(true);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.nameExists).toHaveBeenCalledWith(createDto.name);
    });
  });

  describe('findById', () => {
    it('should return a category by id', async () => {
      mockRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.findById('test-id');

      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockCategory);
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.findById('')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const updateDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      mockRepository.exists.mockResolvedValue(true);
      mockRepository.nameExists.mockResolvedValue(false);
      mockRepository.update.mockResolvedValue({
        ...mockCategory,
        ...updateDto,
      });

      const result = await service.update('test-id', updateDto);

      expect(repository.exists).toHaveBeenCalledWith('test-id');
      expect(repository.nameExists).toHaveBeenCalledWith(
        updateDto.name,
        'test-id',
      );
      expect(repository.update).toHaveBeenCalledWith('test-id', updateDto);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.exists.mockResolvedValue(false);

      await expect(service.update('test-id', { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.findById.mockResolvedValue({
        ...mockCategory,
        courses: [],
      });
      mockRepository.delete.mockResolvedValue(true);

      await service.delete('test-id');

      expect(repository.exists).toHaveBeenCalledWith('test-id');
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw BadRequestException if category has courses', async () => {
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.findById.mockResolvedValue({
        ...mockCategory,
        courses: [{ id: 'course-1' }],
      });

      await expect(service.delete('test-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
