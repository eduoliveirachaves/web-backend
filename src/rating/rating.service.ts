import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingEntity } from './entities/rating.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProduct(
    productId: string,
    paginationDto?: PaginationDto,
  ): Promise<RatingEntity[]> {
    const { limit, offset } = paginationDto || {};
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new HttpException('Esse produto não existe', HttpStatus.NOT_FOUND);
    }

    return this.prisma.rating.findMany({
      take: limit,
      skip: offset,
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByUser(
    userId: string,
    paginationDto?: PaginationDto,
  ): Promise<RatingEntity[]> {
    const { limit, offset } = paginationDto || {};
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return await this.prisma.rating.findMany({
      take: limit,
      skip: offset,
      where: { userId },
      include: { product: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<RatingEntity> {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });

    if (!rating)
      throw new HttpException('Avaliação não encontrada', HttpStatus.NOT_FOUND);
    return rating;
  }

  async create(createRatingDto: CreateRatingDto): Promise<RatingEntity> {
    const { userId, productId, rate, comment } = createRatingDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    const rating = await this.prisma.rating.create({
      data: { userId, productId, rate, comment },
    });

    await this.updateProductAverageRating(productId);

    return rating;
  }

  async update(
    id: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<RatingEntity> {
    const rating = await this.prisma.rating.findUnique({ where: { id } });

    if (!rating) {
      throw new HttpException('Avaliação não encontrada', HttpStatus.NOT_FOUND);
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id },
      data: {
        rate: updateRatingDto.rate ?? rating.rate,
        comment: updateRatingDto.comment ?? rating.comment,
      },
      include: { user: true, product: true },
    });

    await this.updateProductAverageRating(updatedRating.productId);

    return updatedRating;
  }

  async delete(id: string): Promise<{ message: string }> {
    const rating = await this.prisma.rating.findUnique({ where: { id } });

    if (!rating) {
      throw new HttpException('Avaliação não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.prisma.rating.delete({ where: { id } });

    await this.updateProductAverageRating(rating.productId);

    return { message: 'Avaliação excluida com sucesso' };
  }

  private async updateProductAverageRating(productId: string): Promise<void> {
    const ratings = await this.prisma.rating.findMany({
      where: { productId },
      select: { rate: true },
    });

    if (ratings.length === 0) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { averageRating: 0 },
      });
      return;
    }

    const average =
      ratings.reduce((acc, r) => acc + r.rate, 0) / ratings.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: { averageRating: average },
    });
  }
}
