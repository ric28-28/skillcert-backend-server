
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import type { Course } from '../entities/course.entity';
import { CoursesService } from '../providers/courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Controller('courses')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto): Promise<{
    message: string;
    data: Course;
  }> {
    const course = await this.coursesService.create(createCourseDto);
    return {
      message: 'Course created successfully',
      data: course,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('professorId') professorId?: string): Promise<{
    message: string;
    data: Course[];
    count: number;
  }> {
    let courses: Course[];

    if (professorId) {
      courses = await this.coursesService.findByProfessorId(professorId);
    } else {
      courses = await this.coursesService.findAll();
    }

    return {
      message: 'Courses retrieved successfully',
      data: courses,
      count: courses.length,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<{
    message: string;
    data: Course;
  }> {
    const course = await this.coursesService.findById(id);
    return {
      message: 'Course retrieved successfully',
      data: course,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<{
    message: string;
    data: Course;
  }> {
    const course = await this.coursesService.update(id, updateCourseDto);
    return {
      message: 'Course updated successfully',
      data: course,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{
    message: string;
  }> {
    await this.coursesService.delete(id);
    return {
      message: 'Course deleted successfully',
    };
  }

  @Get('professor/:professorId')
  @HttpCode(HttpStatus.OK)
  async findByProfessorId(@Param('professorId') professorId: string): Promise<{
    message: string;
    data: Course[];
    count: number;
  }> {
    const courses = await this.coursesService.findByProfessorId(professorId);
    return {
      message: 'Professor courses retrieved successfully',
      data: courses,
      count: courses.length,
    };
  }

  @Get('category/:categoryId')
  @HttpCode(HttpStatus.OK)
  async findByCategoryId(@Param('categoryId') categoryId: string): Promise<{
    message: string;
    data: Course[];
    count: number;
  }> {
    const courses = await this.coursesService.findByCategoryId(categoryId);
    return {
      message: 'Category courses retrieved successfully',
      data: courses,
      count: courses.length,
    };
  }

  @Get('professor/:professorId/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdAndProfessor(
    @Param('id') id: string,
    @Param('professorId') professorId: string,
  ): Promise<{
    message: string;
    data: Course;
  }> {
    const course = await this.coursesService.findByIdAndProfessor(
      id,
      professorId,
    );
    return {
      message: 'Professor course retrieved successfully',
      data: course,
    };
  }
}
