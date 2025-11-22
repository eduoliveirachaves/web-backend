import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { UserDto } from '@/user/dto/user.dto';
import { RatingDto } from '@/rating/dto/rating.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Exclude()
export class ProductDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Transform(({ value }) => value ?? undefined)
  @Expose()
  description?: string | null;

  @Transform(({ value }) => Number(value))
  @Expose()
  price: Decimal;

  @Expose()
  stock: number;

  @Expose()
  isAvailable: boolean;

  @Transform(({ value }) => value ?? undefined)
  @Expose()
  imageUrl?: string | null;

  @Transform(({ value }) => value ?? undefined)
  @Expose()
  categoryId?: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  sellerId: string;

  @Expose()
  averageRating: number;

  @Expose()
  @Type(() => UserDto)
  seller: UserDto;

  @Expose()
  @Type(() => RatingDto)
  ratings?: RatingDto[] | null;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
