import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAllOrders() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOneOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  createOrder(@Body() body: any) {
    return this.orderService.create(body);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() body: any) {
    return this.orderService.update(id, body);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
