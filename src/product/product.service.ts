import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import type { ProductDto } from 'generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<ProductDto> {
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

  async findAll(paginationDto?: PaginationDto): Promise<ProductDto[]> {
    const { limit, offset } = paginationDto || {};

    return this.prisma.product.findMany({
      take: limit,
      skip: offset,
      include: { seller: { select: { id: true, email: true, name: true } } },
    });
  }

  async findOne(id: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      include: { seller: true },
    });

    if (!product) {
      throw new NotFoundException(`Produto com id ${id} nao encontrado`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDto> {
    const findProduct = await this.prisma.product.findFirst({ where: { id } });

    if (!findProduct) {
      throw new NotFoundException(`Produto com id ${id} nao encontrado`);
    }

    return this.prisma.product.update({
      where: { id: findProduct.id },
      data: dto,
    });
  }

  async remove(id: string): Promise<ProductDto> {
    const findProduct = await this.prisma.product.findFirst({ where: { id } });

    if (!findProduct) {
      throw new NotFoundException(`Produto com id ${id} nao encontrado`);
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
