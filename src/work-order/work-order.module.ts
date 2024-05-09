import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { UserModule } from 'src/user/user.module';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderController } from './work-order.controller';
import { WorkOrderService } from './work-order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrder]),
    ClientModule,
    UserModule
  ],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService]
})
export class WorkOrderModule { }
