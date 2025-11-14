import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodEntity } from './entities/payment-method.entity';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Get('user/:userId')
  findAllByUser(
    @Param('userId') userId: string,
  ): Promise<PaymentMethodEntity[]> {
    return this.paymentMethodService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PaymentMethodEntity> {
    return this.paymentMethodService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return this.paymentMethodService.update(id, updatePaymentMethodDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.paymentMethodService.delete(id);
  }
}
