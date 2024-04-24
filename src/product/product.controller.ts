import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AllProductDto } from './dto/all-product.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes()
  @Auth()
  @Get()
  async getAll(@Query() queryDto: AllProductDto) {
    return this.productService.getAll(queryDto);
  }

  @UsePipes()
  @Auth()
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.byId(+id);
  }

  @UsePipes()
  @Auth()
  @Get('similar/:productId')
  async getSimilar(@Param('productId') productId: string) {
    return this.productService.getSimilar(+productId);
  }

  @UsePipes()
  @Auth()
  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') categorySlug: string) {
    return this.productService.bySlug(categorySlug);
  }

  @UsePipes()
  @Auth()
  @Get('by-category/:categorySlug')
  async getProductByCategory(@Param('categorySlug') slug: string) {
    return this.productService.byCategory(slug);
  }

  @UsePipes()
  @HttpCode(200)
  @Auth()
  @Post()
  async createProduct() {
    return this.productService.create();
  }

  @UsePipes()
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(+id, dto);
  }

  @UsePipes()
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete(+id);
  }
}
