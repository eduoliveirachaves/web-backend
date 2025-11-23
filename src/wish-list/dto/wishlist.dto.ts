import { Exclude, Expose, Type } from 'class-transformer';
import { ProductDto } from '@/product/dto/product.dto';

@Exclude()
export class WishlistDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  addedAt: Date;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

  constructor(partial: Partial<WishlistDto>) {
    Object.assign(this, partial);
  }
}
