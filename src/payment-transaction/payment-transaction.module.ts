import { Module } from '@nestjs/common';
import { PaymentTransactionService } from './payment-transaction.service';
import { PaymentTransactionController } from './payment-transaction.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentTransactionService],
  controllers: [PaymentTransactionController],
})
export class PaymentTransactionModule {}
