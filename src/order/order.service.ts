import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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
      include: { items: true },
    });

    return allOrders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    }));
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    } as OrderEntity;
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { userId, items = [], status } = createOrderDto;

    // Se não há items, cria um pedido vazio (carrinho vazio)
    if (!items || items.length === 0) {
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount: 0,
          status: status || 'IN_CART',
        },
        include: { items: true },
      });

      return {
        ...order,
        totalAmount: 0,
        items: [],
      } as OrderEntity;
    }

    // Caso contrário, processa os items normalmente
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
        status: status || 'PENDING',
        items: { create: orderItems },
      },
      include: { items: true },
    });

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
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    if (updateOrderDto.items && existingOrder.status !== 'IN_CART') {
      throw new HttpException(
        'Não é possível alterar items de um pedido que não está no carrinho',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { items, status } = updateOrderDto;

    let updatedOrder;

    if (items && items.length > 0) {
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: items.map((i) => i.productId!) },
        },
      });

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

      const totalAmount = updatedItems.reduce(
        (acc, item) => acc + Number(item.unitPrice) * (item.quantity ?? 0),
        0,
      );

      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: status ?? existingOrder.status,
          totalAmount,
          items: {
            deleteMany: {},
            create:
              updatedItems as Prisma.OrderItemUncheckedCreateWithoutOrderInput[],
          },
        },
        include: { items: true },
      });
    } else {
      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
    }

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
        'Falha ao deletar o pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ========== MÉTODOS ESPECÍFICOS PARA CARRINHO ==========

  async addItemToCart(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    if (order.status !== 'IN_CART') {
      throw new HttpException(
        'Apenas pedidos com status IN_CART podem ter items adicionados',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    const existingItem = order.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      await this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prisma.orderItem.create({
        data: {
          orderId,
          productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }

    const updatedOrder = await this.recalculateOrderTotal(orderId);
    return updatedOrder;
  }

  async updateCartItemQuantity(
    orderId: string,
    itemId: string,
    quantity: number,
  ): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    if (order.status !== 'IN_CART') {
      throw new HttpException(
        'Apenas pedidos com status IN_CART podem ter items alterados',
        HttpStatus.BAD_REQUEST,
      );
    }

    const item = order.items.find((i) => i.id === itemId);

    if (!item) {
      throw new HttpException(
        'Item não encontrado no pedido',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    const updatedOrder = await this.recalculateOrderTotal(orderId);
    return updatedOrder;
  }

  async removeCartItem(orderId: string, itemId: string): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    if (order.status !== 'IN_CART') {
      throw new HttpException(
        'Apenas pedidos com status IN_CART podem ter items removidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const item = order.items.find((i) => i.id === itemId);

    if (!item) {
      throw new HttpException(
        'Item não encontrado no pedido',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.orderItem.delete({
      where: { id: itemId },
    });

    const updatedOrder = await this.recalculateOrderTotal(orderId);
    return updatedOrder;
  }

  async clearCart(orderId: string): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    if (order.status !== 'IN_CART') {
      throw new HttpException(
        'Apenas pedidos com status IN_CART podem ser limpos',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.orderItem.deleteMany({
      where: { orderId },
    });

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: 0 },
      include: { items: true },
    });

    return {
      ...updatedOrder,
      totalAmount: Number(updatedOrder.totalAmount),
      items: [],
    } as OrderEntity;
  }

  private async recalculateOrderTotal(orderId: string): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    const totalAmount = order.items.reduce(
      (acc, item) => acc + Number(item.unitPrice) * item.quantity,
      0,
    );

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount },
      include: { items: true },
    });

    return {
      ...updatedOrder,
      totalAmount: Number(updatedOrder.totalAmount),
      items: updatedOrder.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
      })),
    } as OrderEntity;
  }
}
