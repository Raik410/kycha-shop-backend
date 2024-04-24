import { Prisma } from '@prisma/client';
import { returnUserObject } from 'src/user/return-data-user';

export const returnReviewObject: Prisma.ReviewSelect = {
  text: true,
  rating: true,
  id: true,
  createdAt: true,
  user: {
    select: returnUserObject,
  },
};
