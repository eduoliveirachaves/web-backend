import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { WishListController } from './wish-list.controller';

@Module({
  providers: [WishListService],
  controllers: [WishListController],
})
export class WishListModule {}
