import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'professor@test.com',
    name: 'Test Professor',
  } as any;

  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Test Category',
  } as any;

  const mockCourse: Course = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Course',
    description: 'Test Description',
    professorId: '123e4567-e89b-12d3-a456-426614174001',
    professor: mockUser,
    modules: [],
    reviews: [],
    enrollments: [],
    categoryId: '123e4567-e89b-12d3-a456-426614174002',
    category: mockCategory,
    objectives: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    acquireReviewAverageRating: jest.fn().mockReturnValue(4.5),
  };

  const mockCoursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a course successfully', async () => {
      const createCourseDto = {
        title: 'New Course',
        description: 'New Description',
      };

      mockCoursesService.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createCourseDto);

      expect(service.create).toHaveBeenCalledWith(createCourseDto);
      expect(result).toEqual(mockCourse);
    });

    it('should create a course without description', async () => {
      const createCourseDto = {
        title: 'New Course',
      };

      mockCoursesService.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createCourseDto);

      expect(service.create).toHaveBeenCalledWith(createCourseDto);
      expect(result).toEqual(mockCourse);
    });

    it('should throw error when service fails', async () => {
      const createCourseDto = {
        title: 'New Course',
        description: 'New Description',
      };

      mockCoursesService.create.mockRejectedValue(
        new BadRequestException('Course creation failed'),
      );

      await expect(controller.create(createCourseDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const courses = [mockCourse, { ...mockCourse, id: 'another-id' }];
      mockCoursesService.findAll.mockResolvedValue(courses);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(courses);
    });

    it('should return empty array when no courses exist', async () => {
      mockCoursesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw error when service fails', async () => {
      mockCoursesService.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.findAll()).rejects.toThrow(Error);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a course by id', async () => {
      mockCoursesService.findOne.mockResolvedValue(mockCourse);

      const result = await controller.findOne(validId);

      expect(service.findOne).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course not found', async () => {
      mockCoursesService.findOne.mockRejectedValue(
        new NotFoundException('Course not found'),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(validId);
    });

    // Note: UUID validation is handled by ParseUUIDPipe, so invalid UUIDs 
    // would be caught before reaching the controller method
  });

  describe('update', () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000';

    it('should update a course successfully', async () => {
      const updateCourseDto = {
        title: 'Updated Course',
        description: 'Updated Description',
      };

      const updatedCourse = { ...mockCourse, ...updateCourseDto };
      mockCoursesService.update.mockResolvedValue(updatedCourse);

      const result = await controller.update(validId, updateCourseDto);

      expect(service.update).toHaveBeenCalledWith(validId, updateCourseDto);
      expect(result).toEqual(updatedCourse);
    });

    it('should update course with partial data', async () => {
      const updateCourseDto = {
        title: 'Updated Title Only',
      };

      const updatedCourse = { ...mockCourse, title: updateCourseDto.title };
      mockCoursesService.update.mockResolvedValue(updatedCourse);

      const result = await controller.update(validId, updateCourseDto);

      expect(service.update).toHaveBeenCalledWith(validId, updateCourseDto);
      expect(result).toEqual(updatedCourse);
    });

    it('should throw NotFoundException when course not found', async () => {
      const updateCourseDto = {
        title: 'Updated Course',
      };

      mockCoursesService.update.mockRejectedValue(
        new NotFoundException('Course not found'),
      );

      await expect(
        controller.update(validId, updateCourseDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(validId, updateCourseDto);
    });
  });

  describe('remove', () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000';

    it('should remove a course successfully', async () => {
      mockCoursesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(validId);

      expect(service.remove).toHaveBeenCalledWith(validId);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when course not found', async () => {
      mockCoursesService.remove.mockRejectedValue(
        new NotFoundException('Course not found'),
      );

      await expect(controller.remove(validId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(validId);
    });

    it('should handle service errors', async () => {
      mockCoursesService.remove.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.remove(validId)).rejects.toThrow(Error);
      expect(service.remove).toHaveBeenCalledWith(validId);
    });
  });

  describe('integration scenarios', () => {
    it('should handle service returning null', async () => {
      mockCoursesService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBeNull();
    });

    it('should handle empty update data', async () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const updateCourseDto = {};

      mockCoursesService.update.mockResolvedValue(mockCourse);

      const result = await controller.update(validId, updateCourseDto);

      expect(service.update).toHaveBeenCalledWith(validId, updateCourseDto);
      expect(result).toEqual(mockCourse);
    });
  });
});