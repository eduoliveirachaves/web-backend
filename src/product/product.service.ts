import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const data = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      sellerId: dto.sellerId,
    };

    return this.prisma.product.create({ data });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { seller: { select: { id: true, email: true, name: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { seller: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
