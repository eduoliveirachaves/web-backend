import { Expose } from 'class-transformer';

export class PaymentMethodEntity {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  type: string;

  @Expose()
  maskedData: string;

  @Expose()
  nickname?: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
