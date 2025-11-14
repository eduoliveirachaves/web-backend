import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodEntity } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: createPaymentMethodDto.userId },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.paymentMethod.create({
      data: createPaymentMethodDto,
    });
  }

  async findAllByUser(userId: string): Promise<PaymentMethodEntity[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<PaymentMethodEntity> {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!method) {
      throw new HttpException(
        'Método de pagamento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return method;
  }

  async update(
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!method) {
      throw new HttpException(
        'Método de pagamento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: updatePaymentMethodDto,
    });
  }

  async delete(id: string): Promise<{ message: string }> {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!method) {
      throw new HttpException(
        'Método de pagamento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.paymentMethod.delete({
      where: { id },
    });

    return { message: 'Método de pagamento excluído com sucesso' };
  }
}
