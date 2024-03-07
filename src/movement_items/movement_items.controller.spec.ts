import { Test, TestingModule } from '@nestjs/testing';
import { MovementItemsController } from './movement_items.controller';
import { MovementItemsService } from './movement_items.service';

describe('MovementItemsController', () => {
  let controller: MovementItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementItemsController],
      providers: [MovementItemsService],
    }).compile();

    controller = module.get<MovementItemsController>(MovementItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
