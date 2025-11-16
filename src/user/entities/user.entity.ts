import { Exclude, Expose, Type } from 'class-transformer';
import { ProductEntity } from '@/product/entities/product.entity';

@Exclude()
export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;

  @Expose()
  role: string;

  @Expose()
  age: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ProductEntity)
  products?: ProductEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
