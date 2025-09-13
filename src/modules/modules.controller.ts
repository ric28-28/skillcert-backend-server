import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { ModulesService } from './modules.service';

@Controller('modules')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async create(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return await this.modulesService.create(createModuleDto);
  }

  @Get()
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
