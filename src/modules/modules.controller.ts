import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { ModuleResponseDto } from './dto/module-response.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async create(@Body() createModuleDto: CreateModuleDto): Promise<ModuleResponseDto> {
    return await this.modulesService.create(createModuleDto);
  }

  @Get()
  async findAll(): Promise<ModuleResponseDto[]> {
    return await this.modulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ModuleResponseDto> {
    return await this.modulesService.findOne(id);
  }

  @Get('course/:courseId')
  async findByCourseId(@Param('courseId', ParseUUIDPipe) courseId: string): Promise<ModuleResponseDto[]> {
    return this.modulesService.findByCourseId(courseId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<ModuleResponseDto> {
    return await this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.modulesService.remove(id);
  }
}