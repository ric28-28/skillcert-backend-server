import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { User } from '../entities/user.entity';
import { UsersService } from '../providers/users.service';

@Controller('users')
@ApiTags('users')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: { message: { type: 'string' }, data: { type: 'object' } },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Validation failed' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    message: string;
    data: User;
  }> {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'array' },
        count: { type: 'number' },
      },
    },
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
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<{
    message: string;
    data: User[];
    count: number;
  }> {
    const users = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully',
      data: users,
      count: users.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: { message: { type: 'string' }, data: { type: 'object' } },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid user ID',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<{
    message: string;
    data: User;
  }> {
    const user = await this.usersService.findById(id);
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: { message: { type: 'string' }, data: { type: 'object' } },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or user ID',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User not found or validation failed',
        },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{
    message: string;
    data: User;
  }> {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: { type: 'object', properties: { message: { type: 'string' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid user ID',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{
    message: string;
  }> {
    await this.usersService.delete(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
