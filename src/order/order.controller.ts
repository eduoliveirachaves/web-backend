import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAllOrders(@Query() paginationDto?: PaginationDto) {
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

  // ========== ENDPOINTS PARA CARRINHO ==========

  /**
   * POST /order/:id/items
   * Adiciona um item ao carrinho (order com status IN_CART)
   */
  @Post(':id/items')
  addItemToCart(
    @Param('id') orderId: string,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return this.orderService.addItemToCart(
      orderId,
      addCartItemDto.productId,
      addCartItemDto.quantity,
    );
  }

  /**
   * PATCH /order/:id/items/:itemId
   * Atualiza a quantidade de um item no carrinho
   */
  @Patch(':id/items/:itemId')
  updateCartItemQuantity(
    @Param('id') orderId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.orderService.updateCartItemQuantity(
      orderId,
      itemId,
      updateCartItemDto.quantity,
    );
  }

  /**
   * DELETE /order/:id/items/:itemId
   * Remove um item do carrinho
   */
  @Delete(':id/items/:itemId')
  removeCartItem(
    @Param('id') orderId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.orderService.removeCartItem(orderId, itemId);
  }

  /**
   * DELETE /order/:id/items
   * Limpa todos os items do carrinho
   */
  @Delete(':id/items')
  clearCart(@Param('id') orderId: string) {
    return this.orderService.clearCart(orderId);
  }
}
