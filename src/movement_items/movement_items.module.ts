import { Module } from '@nestjs/common';
import { MovementItemsService } from './movement_items.service';
import { MovementItemsController } from './movement_items.controller';

@Module({
  controllers: [MovementItemsController],
  providers: [MovementItemsService]
})
export class MovementItemsModule {}
