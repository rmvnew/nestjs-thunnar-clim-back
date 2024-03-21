import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricModule } from 'src/historic/historic.module';
import { MovementModule } from 'src/moviment/movement.module';
import { ProductModule } from 'src/product/product.module';
import { MovementItem } from './entities/movement_item.entity';
import { MovementItemsController } from './movement_items.controller';
import { MovementItemsService } from './movement_items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovementItem]),
    HistoricModule,
    MovementModule,
    ProductModule
  ],
  controllers: [MovementItemsController],
  providers: [MovementItemsService],
  exports: [MovementItemsService]
})
export class MovementItemsModule { }
