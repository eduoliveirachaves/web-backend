import { Exclude, Expose, Type } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';

@Exclude()
export class ProductEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  isAvailable: boolean;

  @Expose()
  imageUrl?: string;

  @Expose()
  categoryId?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  sellerId: string;

  @Expose()
  @Type(() => UserEntity)
  seller?: UserEntity;
}
