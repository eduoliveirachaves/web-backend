import { Test, TestingModule } from '@nestjs/testing';
import { WishListController } from './wish-list.controller';

describe('WishListController', () => {
  let controller: WishListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishListController],
    }).compile();

    controller = module.get<WishListController>(WishListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
