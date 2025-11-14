import { Expose } from 'class-transformer';

export class PaymentTransactionEntity {
  @Expose()
  id: string;

  @Expose()
  orderId: string;

  @Expose()
  amount: number;

  @Expose()
  status: string;

  @Expose()
  gateway: string;

  @Expose()
  gatewayResponse?: string | null;

  @Expose()
  transactionAt: Date;

  @Expose()
  updatedAt: Date;
}
