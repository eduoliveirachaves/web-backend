import { Exclude, Expose, Type } from 'class-transformer';
import { ProductEntity } from '@/product/entities/product.entity';
import type { Role } from 'generated/prisma/client';

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
  role: Role;

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
