import { Exclude, Expose, Type } from 'class-transformer';
import { OrderItemEntity } from './order-item.entity';

@Exclude()
export class OrderEntity {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  totalAmount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  status: string;

  @Expose()
  @Type(() => OrderItemEntity)
  items?: OrderItemEntity[];
}
