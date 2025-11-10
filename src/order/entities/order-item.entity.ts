import { ProductEntity } from '@/product/entities/product.entity';
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
  @Type(() => ProductEntity)
  product?: ProductEntity;
}
