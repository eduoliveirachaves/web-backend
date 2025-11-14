import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '@/product/product.module';
import { OrderModule } from '@/order/order.module';
import { CategoryModule } from '@/category/category.module';
import { RatingModule } from '@/rating/rating.module';
import { AdressModule } from '@/adress/adress.module';
import { PaymentMethodModule } from '@/payment-method/payment-method.module';
import { PaymentTransactionModule } from '@/payment-transaction/payment-transaction.module';
import { WishListModule } from '@/wish-list/wish-list.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    RatingModule,
    AdressModule,
    PaymentMethodModule,
    PaymentTransactionModule,
    WishListModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
