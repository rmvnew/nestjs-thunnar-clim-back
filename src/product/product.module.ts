import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricModule } from 'src/historic/historic.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    HistoricModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }