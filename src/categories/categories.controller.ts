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
import { Category } from '../entities/category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<{
    message: string;
    data: Category;
  }> {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<{
    message: string;
    data: Category[];
    count: number;
  }> {
    const categories = await this.categoriesService.findAll();
    return {
      message: 'Categories retrieved successfully',
      data: categories,
      count: categories.length,
    };
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  async findActiveCategories(): Promise<{
    message: string;
    data: Category[];
    count: number;
  }> {
    const categories = await this.categoriesService.findActiveCategories();
    return {
      message: 'Active categories retrieved successfully',
      data: categories,
      count: categories.length,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<{
    message: string;
    data: Category;
  }> {
    const category = await this.categoriesService.findById(id);
    return {
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{
    message: string;
    data: Category;
  }> {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return {
      message: 'Category updated successfully',
      data: category,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{
    message: string;
  }> {
    await this.categoriesService.delete(id);
    return {
      message: 'Category deleted successfully',
    };
  }

  @Get(':id/courses-count')
  @HttpCode(HttpStatus.OK)
  async getCoursesCount(@Param('id') id: string): Promise<{
    message: string;
    data: { categoryId: string; coursesCount: number };
  }> {
    const coursesCount = await this.categoriesService.getCoursesCount(id);
    return {
      message: 'Category courses count retrieved successfully',
      data: { categoryId: id, coursesCount },
    };
  }
}
