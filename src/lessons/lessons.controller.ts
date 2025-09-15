import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponseDto } from './dto/lesson-response.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLessonDto: CreateLessonDto): Promise<{ message: string; data: LessonResponseDto }> {
    const lesson = await this.lessonsService.create(createLessonDto);
    return { message: 'Lesson created successfully', data: lesson };
  }

  @Get()
  async findAll(): Promise<{ message: string; data: LessonResponseDto[] }> {
    const lessons = await this.lessonsService.findAll();
    return { message: 'Lessons fetched successfully', data: lessons };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string; data: LessonResponseDto }> {
    const lesson = await this.lessonsService.findOne(id);
    return { message: 'Lesson fetched successfully', data: lesson };
  }

  @Get('module/:moduleId')
  async findByModuleId(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
  ): Promise<{ message: string; data: LessonResponseDto[] }> {
    const lessons = await this.lessonsService.findByModuleId(moduleId);
    return { message: 'Lessons by module fetched successfully', data: lessons };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<{ message: string; data: LessonResponseDto }> {
    const lesson = await this.lessonsService.update(id, updateLessonDto);
    return { message: 'Lesson updated successfully', data: lesson };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.lessonsService.remove(id);
  }
}
