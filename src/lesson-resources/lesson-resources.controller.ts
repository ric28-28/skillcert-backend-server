import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  LessonResource,
  ResourceType,
} from '../entities/lesson-resource.entity';
import { CreateLessonResourceDto } from './dto/create-lesson-resource.dto';
import { UpdateLessonResourceDto } from './dto/update-lesson-resource.dto';
import { LessonResourcesService } from './lesson-resources.service';

@Controller('lesson-resources')
export class LessonResourcesController {
  constructor(
    private readonly lessonResourcesService: LessonResourcesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadDto: CreateLessonResourceDto,
  ): Promise<{
    message: string;
    data: LessonResource;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const resource = await this.lessonResourcesService.create(
      file,
      fileUploadDto,
    );

    return {
      message: 'Lesson resource created successfully',
      data: resource,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('type') type?: ResourceType): Promise<{
    message: string;
    data: LessonResource[];
    count: number;
  }> {
    let resources: LessonResource[];

    if (type) {
      resources = await this.lessonResourcesService.findByResourceType(type);
    } else {
      resources = await this.lessonResourcesService.findAll();
    }

    return {
      message: 'Lesson resources retrieved successfully',
      data: resources,
      count: resources.length,
    };
  }

  @Get('lesson/:lessonId')
  @HttpCode(HttpStatus.OK)
  async findByLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ): Promise<{
    message: string;
    data: LessonResource[];
    count: number;
  }> {
    const resources = await this.lessonResourcesService.findByLesson(lessonId);

    return {
      message: 'Lesson resources retrieved successfully',
      data: resources,
      count: resources.length,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{
    message: string;
    data: LessonResource;
  }> {
    const resource = await this.lessonResourcesService.findOne(id);

    return {
      message: 'Lesson resource retrieved successfully',
      data: resource,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonResourceDto: UpdateLessonResourceDto,
  ): Promise<{
    message: string;
    data: LessonResource;
  }> {
    const resource = await this.lessonResourcesService.update(
      id,
      updateLessonResourceDto,
    );

    return {
      message: 'Lesson resource updated successfully',
      data: resource,
    };
  }

  @Post(':id/download')
  @HttpCode(HttpStatus.OK)
  async trackDownload(@Param('id', ParseUUIDPipe) id: string): Promise<{
    message: string;
  }> {
    await this.lessonResourcesService.incrementDownloadCount(id);

    return {
      message: 'Download tracked successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.lessonResourcesService.softDelete(id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  async permanentDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.lessonResourcesService.permanentDelete(id);
  }
}
