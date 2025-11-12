import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RatingEntity } from './entities/rating.entity';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<RatingEntity> {
    return this.ratingService.create(createRatingDto);
  }

  @Get('product/:productId')
  async findAllByProduct(
    @Param('productId') productId: string,
    @Query() paginationDto?: PaginationDto,
  ): Promise<RatingEntity[]> {
    return this.ratingService.findAllByProduct(productId, paginationDto);
  }

  @Get('user/:userId')
  async findAllByUser(
    @Param('userId') userId: string,
    @Query() paginationDto?: PaginationDto,
  ): Promise<RatingEntity[]> {
    return this.ratingService.findAllByUser(userId, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RatingEntity> {
    return this.ratingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<RatingEntity> {
    return this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.ratingService.delete(id);
  }
}
