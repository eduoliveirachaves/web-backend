import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { PaymentTransactionEntity } from './entities/payment-transaction.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class PaymentTransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPaymentTransactionDto: CreatePaymentTransactionDto,
  ): Promise<PaymentTransactionEntity> {
    const { orderId, amount, gateway, status, gatewayResponse } =
      createPaymentTransactionDto;

    // Valida se o pedido existe
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    // Verifica se o pedido está em um estado válido para pagamento
    if (order.status === 'IN_CART') {
      throw new HttpException(
        'Não é possível processar pagamento para pedidos no carrinho',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Cria a transação
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        orderId,
        amount,
        gateway,
        status: status || 'AGUARDANDO',
        gatewayResponse,
      },
    });

    return {
      ...transaction,
      amount: Number(transaction.amount),
    } as PaymentTransactionEntity;
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaymentTransactionEntity[]> {
    const { limit, offset } = paginationDto || {};

    const transactions = await this.prisma.paymentTransaction.findMany({
      take: limit,
      skip: offset,
      orderBy: { transactionAt: 'desc' },
    });

    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })) as PaymentTransactionEntity[];
  }

  async findAllByOrder(orderId: string): Promise<PaymentTransactionEntity[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
    }

    const transactions = await this.prisma.paymentTransaction.findMany({
      where: { orderId },
      orderBy: { transactionAt: 'desc' },
    });

    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })) as PaymentTransactionEntity[];
  }

  async findOne(id: string): Promise<PaymentTransactionEntity> {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            userId: true,
            totalAmount: true,
            status: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new HttpException('Transação não encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      ...transaction,
      amount: Number(transaction.amount),
      order: transaction.order
        ? {
            ...transaction.order,
            totalAmount: Number(transaction.order.totalAmount),
          }
        : undefined,
    } as PaymentTransactionEntity;
  }

  async update(
    id: string,
    updatePaymentTransactionDto: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransactionEntity> {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new HttpException('Transação não encontrada', HttpStatus.NOT_FOUND);
    }

    // Se o status mudou para CONFIRMADO, atualiza o status do pedido
    if (
      (updatePaymentTransactionDto.status as string) === 'CONFIRMADO' &&
      transaction.status !== 'CONFIRMADO'
    ) {
      await this.prisma.order.update({
        where: { id: transaction.orderId },
        data: { status: 'PAID' },
      });
    }

    const updated = await this.prisma.paymentTransaction.update({
      where: { id },
      data: updatePaymentTransactionDto,
    });

    return {
      ...updated,
      amount: Number(updated.amount),
    } as PaymentTransactionEntity;
  }

  async delete(id: string): Promise<{ message: string }> {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new HttpException('Transação não encontrada', HttpStatus.NOT_FOUND);
    }

    // Não permite deletar transações confirmadas
    if (transaction.status === 'CONFIRMADO') {
      throw new HttpException(
        'Não é possível deletar transações confirmadas',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.paymentTransaction.delete({
      where: { id },
    });

    return { message: 'Transação excluída com sucesso' };
  }
}
