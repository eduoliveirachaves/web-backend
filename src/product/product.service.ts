import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const data = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      imageUrl: dto.imageUrl,
      categoryId: dto.categoryId,
      sellerId: dto.sellerId,
    };

    return this.prisma.product.create({ data });
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit, offset } = paginationDto || {};
    const allProducts = await this.prisma.product.findMany({
      take: limit,
      skip: offset,
      include: { seller: { select: { id: true, email: true, name: true } } },
    });

    return allProducts;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      include: { seller: true },
    });

    if (product?.id) return product;

    throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
  }

  async update(id: string, dto: UpdateProductDto) {
    const findProduct = await this.prisma.product.findFirst({ where: { id } });

    if (!findProduct) {
      throw new HttpException(
        'O produto não foi encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const product = await this.prisma.product.update({
      where: { id: findProduct.id },
      data: dto,
    });

    return product;
  }

  async remove(id: string) {
    const findProduct = await this.prisma.product.findFirst({ where: { id } });

    if (!findProduct) {
      throw new HttpException(
        'O produto não foi encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
