import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [PrismaModule],
  exports: [OrderItemService],
  providers: [OrderItemService],
})
export class OrderItemModule {}
