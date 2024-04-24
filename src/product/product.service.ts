import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { AllProductDto, EnumProductSort } from './dto/all-product.dto';
import { ProductDto } from './dto/product.dto';
import {
  returnProductFullestObject,
  returnProductObject,
} from './return-data-product';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: returnProductFullestObject,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getAll(dto: AllProductDto = {}) {
    const { searchTerm, sort } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []; // TODO: Ask about this

    switch (sort) {
      case EnumProductSort.LOW_PRICE:
        prismaSort.push({ price: 'asc' });
        break;
      case EnumProductSort.HIGN_PRICE:
        prismaSort.push({ price: 'desc' });
        break;
      case EnumProductSort.OLDEST:
        prismaSort.push({ createdAt: 'asc' });
        break;
      default:
        prismaSort.push({ createdAt: 'desc' });
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: +perPage,
    });

    return { products, length: products.length };
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: returnProductFullestObject,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: returnProductFullestObject,
    });

    if (!products) throw new NotFoundException('Category not found');

    return products;
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct) throw new NotFoundException('Product not found');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      select: returnProductObject,
    });

    if (!products) throw new NotFoundException('Product not found');

    return products;
  }

  async update(id: number, dto: ProductDto) {
    const { categoryId, description, images, name, price } = dto;

    const product = await this.byId(id);

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        images,
        category: {
          connect: {
            id: categoryId,
          },
        },
        slug: faker.helpers.slugify(name).toLowerCase(),
      },
    });
  }

  async delete(id: number) {
    const product = await this.byId(id);

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async create() {
    return this.prisma.product.create({
      data: {
        name: '',
        slug: '',
        description: '',
        price: 0,
      },
    });
  }
}
