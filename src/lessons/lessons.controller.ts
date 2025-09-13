import {
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
} from '@nestjs/common';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  async findAll( @Query('page') page = 1,
    @Query('limit') limit = 10,): Promise<Lesson[]> {
     return this.lessonsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Lesson> {
    return this.lessonsService.findOne(id);
  }

  @Get('module/:moduleId')
  async findByModuleId(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,   @Query('page') page = 1, @Query('limit') limit = 10,
  ): Promise<Lesson[]> {
    return this.lessonsService.findByModuleId(moduleId, page, limit);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.lessonsService.remove(id);
  }
}

// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Put,
//   ParseUUIDPipe,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { LessonsService } from './lessons.service';
// import { Lesson, LessonType } from '../entities/lesson.entity';

// @Controller('lessons')
// export class LessonsController {
//   constructor(private readonly lessonsService: LessonsService) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   create(
//     @Body()
//     createLessonDto: {
//       title: string;
//       content?: string;
//       type: LessonType;
//       module_id: string;
//     },
//   ): Promise<Lesson> {
//     return this.lessonsService.create(createLessonDto);
//   }

//   @Get()
//   @HttpCode(HttpStatus.OK)
//   findAll(): Promise<Lesson[]> {
//     return this.lessonsService.findAll();
//   }

//   @Get(':id')
//   @HttpCode(HttpStatus.OK)
//   findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Lesson> {
//     return this.lessonsService.findOne(id);
//   }

//   @Get('module/:moduleId')
//   @HttpCode(HttpStatus.OK)
//   findByModule(
//     @Param('moduleId', ParseUUIDPipe) moduleId: string,
//   ): Promise<Lesson[]> {
//     return this.lessonsService.findByModule(moduleId);
//   }

//   @Put(':id')
//   @HttpCode(HttpStatus.OK)
//   update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body()
//     updateLessonDto: {
//       title?: string;
//       content?: string;
//       type?: LessonType;
//     },
//   ): Promise<Lesson> {
//     return this.lessonsService.update(id, updateLessonDto);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
//     return this.lessonsService.remove(id);
//   }
// }
