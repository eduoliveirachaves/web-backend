import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
@Injectable()
export class OrderService {
  //Apenas para testar a funcionalidade das rotas (sem Banco de dados)
  private orders: Order[] = [
    {
      id: 1,
      userId: 1,
      totalAmount: 5,
      status: 'em analise',
    },
  ];

  findAll() {
    return this.orders;
  }

  findOne(id: string) {
    return this.orders.find((order) => order.id === Number(id));
  }

  create(body: any) {
    const newId = this.orders.length + 1;

    const newOrder = {
      id: newId,
      ...body,
    };

    this.orders.push(newOrder);

    return newOrder;
  }

  update(id: string, body: any) {
    const orderIndex = this.orders.findIndex(
      (order) => order.id === Number(id),
    );

    if (orderIndex >= 0) {
      const orderItem = this.orders[orderIndex];

      this.orders[orderIndex] = {
        ...orderItem,
        ...body,
      };
    }
    return;
  }
}
