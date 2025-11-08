import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  findAll() {
    return;
  }

  findOne(id: string) {
    return id;
  }

  create(body: any) {
    return body;
  }
}
