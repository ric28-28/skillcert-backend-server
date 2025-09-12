import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { ModulesService } from './modules.service';

@Controller('modules')
@ApiTags('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @ApiResponse({
    status: 201,
    description: 'Module created successfully',
    type: Module,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Validation failed' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async create(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return await this.modulesService.create(createModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({
    status: 200,
    description: 'Modules retrieved successfully',
    type: [Module],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async findAll(): Promise<Module[]> {
    return await this.modulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Module> {
    return await this.modulesService.findOne(id);
  }

  @Get('course/:courseId')
  async findByCourseId(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Module[]> {
    return this.modulesService.findByCourseId(courseId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module> {
    return await this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.modulesService.remove(id);
  }
}
