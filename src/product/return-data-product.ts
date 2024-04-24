import { Prisma } from '@prisma/client';
import { returnCategoryObject } from 'src/category/return-data-categoty';
import { returnReviewObject } from 'src/review/return-data-review';

export const returnProductObject: Prisma.ProductSelect = {
  images: true,
  id: true,
  name: true,
  price: true,
  description: true,
  slug: true,
  createdAt: true,
};

export const returnProductFullestObject: Prisma.ProductSelect = {
  ...returnProductObject,
  category: {
    select: returnCategoryObject,
  },
  reviews: {
    select: returnReviewObject,
  },
};
