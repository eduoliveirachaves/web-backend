import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
