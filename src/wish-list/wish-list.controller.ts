import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import type { User } from 'generated/prisma/client';
import { WishlistDto } from '@/wish-list/dto/wishlist.dto';
import { ProductDto } from '@/product/dto/product.dto';

@UseGuards(JwtAuthGuard)
@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() createWishListDto: CreateWishListDto,
  ): Promise<WishlistDto> {
    const item = await this.wishListService.create(user.id, createWishListDto);
    return new WishlistDto({
      id: item.id,
      productId: item.productId,
      addedAt: item.addedAt,
      product: new ProductDto(item.product),
    });
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<WishlistDto[]> {
    const items = await this.wishListService.findAll(user.id);

    if (!items || items.length === 0) {
      throw new NotFoundException('No wish lists found for the user.');
    }

    return items.map(
      (item) =>
        new WishlistDto({
          id: item.id,
          productId: item.productId,
          addedAt: item.addedAt,
          product: new ProductDto(item.product),
        }),
    );
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this.wishListService.remove(user.id, productId);
  }
}
