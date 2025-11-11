import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RatingEntity {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  productId: string;

  @Expose()
  rate: number;

  @Expose()
  comment?: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
