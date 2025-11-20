import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductModule } from '@/product/product.module';
import { OrderModule } from '@/order/order.module';
import { CategoryModule } from '@/category/category.module';
import { RatingModule } from '@/rating/rating.module';
import { AdressModule } from '@/adress/adress.module';
import { PaymentMethodModule } from '@/payment-method/payment-method.module';
import { PaymentTransactionModule } from '@/payment-transaction/payment-transaction.module';
import { WishListModule } from '@/wish-list/wish-list.module';
import { AppController } from '@/app/app.controller';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/config/app.config';
import * as Joi from 'joi';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
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
  controllers: [UserController, AppController],
  providers: [
    UserService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
