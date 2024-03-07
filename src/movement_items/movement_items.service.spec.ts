import { Test, TestingModule } from '@nestjs/testing';
import { MovementItemsService } from './movement_items.service';

describe('MovementItemsService', () => {
  let service: MovementItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementItemsService],
    }).compile();

    service = module.get<MovementItemsService>(MovementItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
