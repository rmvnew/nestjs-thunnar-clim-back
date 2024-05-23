import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { CompanyModule } from 'src/company/company.module';
import { HistoricModule } from 'src/historic/historic.module';
import { UserModule } from 'src/user/user.module';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderController } from './work-order.controller';
import { WorkOrderService } from './work-order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrder]),
    ClientModule,
    UserModule,
    CompanyModule,
    HistoricModule
  ],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService]
})
export class WorkOrderModule { }
