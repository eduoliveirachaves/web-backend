import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductEntity } from '@/product/entities/product.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { PaginationDto } from '@/common/dto/pagination.dto';
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto?: PaginationDto) {
    const { limit, offset } = paginationDto || {};
    const allOrders = await this.prisma.order.findMany({
      take: limit,
      skip: offset,
    });
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

    // Converter campos Decimal para number manualmente. Sem isso a logica nao estava funcionando.
    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    } as OrderEntity;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    // Verifica se a ordem existe
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    const { items, status } = updateOrderDto;

    let updatedOrder;

    // Caso o update inclua novos items (alteração de produtos ou quantidades)
    if (items && items.length > 0) {
      // Busca os produtos dos items
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: items.map((i) => i.productId!) },
        },
      });

      // Monta os novos items
      const updatedItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new HttpException(
            'Produto não encontrado',
            HttpStatus.NOT_FOUND,
          );

        return {
          productId: product.id,
          quantity: item.quantity ?? 1,
          unitPrice: product.price,
        };
      });

      // Recalcula total
      const totalAmount = updatedItems.reduce(
        (acc, item) => acc + Number(item.unitPrice) * (item.quantity ?? 0),
        0,
      );

      // Atualiza ordem (deleta items antigos e recria)
      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: status ?? existingOrder.status,
          totalAmount,
          items: {
            deleteMany: {}, // remove items antigos
            create:
              updatedItems as Prisma.OrderItemUncheckedCreateWithoutOrderInput[], // recria os novos
          },
        },
        include: { items: true },
      });
    } else {
      // Atualiza apenas o status ou campos simples
      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
    }

    // Converte Decimal → number
    return {
      ...updatedOrder,
      totalAmount: Number(updatedOrder.totalAmount),
      items: updatedOrder.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    } as OrderEntity;
  }

  async delete(id: string) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
      }

      //Necessario para deletar os items do pedido antes do pedido ser deletado.
      // Implementar no schema do prisma depois e retirar daqui.
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      await this.prisma.order.delete({
        where: { id },
      });

      return {
        message: 'Pedido excluído com sucesso',
      };
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar a tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
