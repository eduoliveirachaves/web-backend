import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { WishList } from 'generated/prisma/client';
import { CreateWishListDto } from '@/wish-list/dto/create-wish-list.dto';

@Injectable()
export class WishListService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    userId: string,
    createWishListDto: CreateWishListDto,
  ): Promise<WishList & { product: any }> {
    const { productId } = createWishListDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingItem = await this.prisma.wishList.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    return this.prisma.wishList.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            seller: true,
            ratings: true,
          },
        },
      },
    });
  }

  async findAll(userId: string): Promise<(WishList & { product: any })[]> {
    const wishlistItems = await this.prisma.wishList.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        addedAt: 'desc',
      },
    });

    return wishlistItems;
  }

  async remove(userId: string, productId: string): Promise<WishList> {
    try {
      return await this.prisma.wishList.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
    } catch (_error) {
      throw new NotFoundException('Item not found in wishlist');
    }
  }
}
