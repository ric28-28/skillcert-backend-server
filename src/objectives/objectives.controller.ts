import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@Controller('objectives')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createObjectiveDto: CreateObjectiveDto) {
    const objective = await this.objectivesService.create(createObjectiveDto);
    return {
      success: true,
      message: 'Objective created successfully',
      data: objective,
    };
  }

  @Get()
  async findAll() {
    const objectives = await this.objectivesService.findAll();
    return {
      success: true,
      message: 'Objectives retrieved successfully',
      data: objectives,
    };
  }

  @Get('course/:courseId')
  async findAllByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    const objectives = await this.objectivesService.findAllByCourse(courseId);
    return {
      success: true,
      message: 'Course objectives retrieved successfully',
      data: objectives,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const objective = await this.objectivesService.findOne(id);
    return {
      success: true,
      message: 'Objective retrieved successfully',
      data: objective,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateObjectiveDto: UpdateObjectiveDto,
  ) {
    const objective = await this.objectivesService.update(
      id,
      updateObjectiveDto,
    );
    return {
      success: true,
      message: 'Objective updated successfully',
      data: objective,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.objectivesService.remove(id);
    return {
      success: true,
      message: 'Objective deleted successfully',
    };
  }

  @Put('course/:courseId/reorder')
  async reorder(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body('objectiveIds') objectiveIds: string[],
  ) {
    const objectives = await this.objectivesService.reorder(
      courseId,
      objectiveIds,
    );
    return {
      success: true,
      message: 'Objectives reordered successfully',
      data: objectives,
    };
  }
}
