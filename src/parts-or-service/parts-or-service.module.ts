import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from 'src/device/device.module';
import { ProductModule } from 'src/product/product.module';
import { PartsOrService } from './entities/parts-or-service.entity';
import { PartsOrServiceController } from './parts-or-service.controller';
import { PartsOrServiceService } from './parts-or-service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartsOrService]),
    DeviceModule,
    ProductModule
  ],
  controllers: [PartsOrServiceController],
  providers: [PartsOrServiceService],
  exports: [PartsOrServiceService]
})
export class PartsOrServiceModule { }
