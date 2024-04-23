import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnUserObject } from './return-data-user';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { hash } from 'argon2';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...returnUserObject,
        favorite: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        ...selectObject,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(id: number, dto: UserDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (isSameUser && id !== isSameUser.id) {
      throw new BadRequestException('Email already in use');
    }

    const user = await this.byId(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        avatarPath: dto.avatarPath,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });
  }

  async toggleFavorite(currentUserId: number, productId: number) {
    const user = await this.byId(currentUserId);
    console.log(user, 'user');

    if (!user) throw new NotFoundError('User not found');

    const isExist = user.favorite.some((product) => product.id === productId);

    if (isExist) {
      await this.prisma.user.update({
        where: { id: currentUserId },
        data: {
          favorite: {
            disconnect: { id: productId },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: currentUserId },
        data: {
          favorite: {
            connect: { id: productId },
          },
        },
      });
    }

    return { message: 'Success' };
  }
}
