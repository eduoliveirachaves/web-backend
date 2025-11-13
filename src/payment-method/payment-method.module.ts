import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  providers: [PaymentMethodService],
  controllers: [PaymentMethodController],
})
export class PaymentMethodModule {}
