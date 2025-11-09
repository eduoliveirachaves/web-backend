import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [PrismaModule, OrderItemModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
