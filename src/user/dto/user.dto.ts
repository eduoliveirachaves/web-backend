import { Exclude, Expose, Type } from 'class-transformer';
import { ProductDto } from '@/product/dto/product.dto';
import type { Role } from 'generated/prisma/client';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;

  @Exclude()
  role: Role;

  @Expose()
  age: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  @Type(() => ProductDto)
  products?: ProductDto[];

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
