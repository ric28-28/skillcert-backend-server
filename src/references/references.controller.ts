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
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Reference } from '../entities/reference.entity';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ReferencesService } from './references.service';

@Controller('references')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReferenceDto: CreateReferenceDto): Promise<Reference> {
    return this.referencesService.create(createReferenceDto);
  }

  @Get()
  findAll(): Promise<Reference[]> {
    return this.referencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reference> {
    return this.referencesService.findOne(id);
  }

  @Get('module/:moduleId')
  findByModule(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
  ): Promise<Reference[]> {
    return this.referencesService.findByModule(moduleId);
  }

  @Get('lesson/:lessonId')
  findByLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ): Promise<Reference[]> {
    return this.referencesService.findByLesson(lessonId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ): Promise<Reference> {
    return this.referencesService.update(id, updateReferenceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.referencesService.remove(id);
  }
}
