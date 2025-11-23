import { ProductDto } from '@/product/dto/product.dto';
import { Expose, Type } from 'class-transformer';

export class OrderItemEntity {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;

  @Expose()
  @Type(() => ProductDto)
  product?: ProductDto;
}
