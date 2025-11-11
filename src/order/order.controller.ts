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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAllOrders(paginationDto?: PaginationDto) {
    return this.orderService.findAll(paginationDto);
  }

  @Get(':id')
  findOneOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
