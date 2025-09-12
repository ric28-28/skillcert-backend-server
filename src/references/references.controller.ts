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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reference } from '../entities/reference.entity';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ReferencesService } from './references.service';

@Controller('references')
@ApiTags('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reference' })
  @ApiResponse({
    status: 201,
    description: 'Reference created successfully',
    type: Reference,
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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReferenceDto: CreateReferenceDto): Promise<Reference> {
    return this.referencesService.create(createReferenceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all references' })
  @ApiResponse({
    status: 200,
    description: 'References retrieved successfully',
    type: [Reference],
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
  findAll(): Promise<Reference[]> {
    return this.referencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reference by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reference retrieved successfully',
    type: Reference,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Reference not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reference> {
    return this.referencesService.findOne(id);
  }

  @Get('module/:moduleId')
  @ApiOperation({ summary: 'Get references by module ID' })
  @ApiResponse({
    status: 200,
    description: 'References retrieved successfully',
    type: [Reference],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Module not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findByModule(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
  ): Promise<Reference[]> {
    return this.referencesService.findByModule(moduleId);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get references by lesson ID' })
  @ApiResponse({
    status: 200,
    description: 'References retrieved successfully',
    type: [Reference],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Lesson not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findByLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ): Promise<Reference[]> {
    return this.referencesService.findByLesson(lessonId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reference by ID' })
  @ApiResponse({
    status: 200,
    description: 'Reference updated successfully',
    type: Reference,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reference not found or validation failed',
        },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReferenceDto: UpdateReferenceDto,
  ): Promise<Reference> {
    return this.referencesService.update(id, updateReferenceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reference by ID' })
  @ApiResponse({ status: 204, description: 'Reference deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Reference not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.referencesService.remove(id);
  }
}
