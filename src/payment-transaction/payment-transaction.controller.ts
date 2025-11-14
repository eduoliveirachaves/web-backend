import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentTransactionService } from './payment-transaction.service';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { PaymentTransactionEntity } from './entities/payment-transaction.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('payment-transaction')
export class PaymentTransactionController {
  constructor(
    private readonly paymentTransactionService: PaymentTransactionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPaymentTransactionDto: CreatePaymentTransactionDto,
  ): Promise<PaymentTransactionEntity> {
    return this.paymentTransactionService.create(createPaymentTransactionDto);
  }

  @Get()
  findAll(
    @Query() paginationDto?: PaginationDto,
  ): Promise<PaymentTransactionEntity[]> {
    return this.paymentTransactionService.findAll(paginationDto);
  }

  @Get('order/:orderId')
  findAllByOrder(
    @Param('orderId') orderId: string,
  ): Promise<PaymentTransactionEntity[]> {
    return this.paymentTransactionService.findAllByOrder(orderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PaymentTransactionEntity> {
    return this.paymentTransactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentTransactionDto: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransactionEntity> {
    return this.paymentTransactionService.update(
      id,
      updatePaymentTransactionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.paymentTransactionService.delete(id);
  }
}
