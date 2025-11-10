import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductEntity } from '@/product/entities/product.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const allOrders = await this.prisma.order.findMany();
    return allOrders;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: id,
      },
    });

    if (order?.id) return order;

    throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { userId, items } = createOrderDto;

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: items.map((i) => i.productId) },
      },
    });

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.unitPrice.toNumber() * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Converter campos Decimal para number manualmente
    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    } as OrderEntity;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {}

  delete(id: string) {}
}
