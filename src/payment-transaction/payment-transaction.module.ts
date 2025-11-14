import { Module } from '@nestjs/common';
import { PaymentTransactionService } from './payment-transaction.service';
import { PaymentTransactionController } from './payment-transaction.controller';

@Module({
  providers: [PaymentTransactionService],
  controllers: [PaymentTransactionController]
})
export class PaymentTransactionModule {}
