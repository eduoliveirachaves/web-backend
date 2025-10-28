// src/product/product.module.ts

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importamos o Prisma!

@Module({
  imports: [PrismaModule], // Agora o ProductService pode usar o Prisma
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
