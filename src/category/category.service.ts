import { PaginationDto } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findall(paginationDto?: PaginationDto): Promise<CategoryEntity[]> {
    const { limit, offset } = paginationDto || {};
    const allCategories = await this.prisma.category.findMany({
      take: limit,
      skip: offset,
    });
    return allCategories;
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new HttpException('Categoria Não Encontrada', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (existingCategory) {
      throw new HttpException(
        'Essa categoria já existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HttpException(
        'Essa categoria Não efoi encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async delete(id: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }
}
