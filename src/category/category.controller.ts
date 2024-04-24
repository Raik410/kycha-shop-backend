import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  @Auth()
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @Get('by-slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }

  @Get()
  @Auth()
  async getAll() {
    return this.categoryService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':categoryId')
  @Auth()
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.update(+categoryId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @HttpCode(200)
  @Delete(':categoryId')
  @Auth()
  async deleteCategory(@Param('categoryId') categoryId: string) {
    console.log('Delele');
    return this.categoryService.delete(+categoryId);
  }
}
