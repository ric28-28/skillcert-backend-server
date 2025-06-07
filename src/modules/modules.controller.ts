import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from '../entities/module.entity';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createModuleDto: {
      title: string;
      description?: string;
      course_id: string;
    },
  ): Promise<Module> {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Module> {
    return this.modulesService.findOne(id);
  }

  @Get('course/:courseId')
  @HttpCode(HttpStatus.OK)
  findByCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Module[]> {
    return this.modulesService.findByCourse(courseId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: { title?: string; description?: string },
  ): Promise<Module> {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.modulesService.remove(id);
  }
}
