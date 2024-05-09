import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Historic } from './entities/historic.entity';
import { HistoricController } from './historic.controller';
import { HistoricService } from './historic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Historic]),
    forwardRef(() => UserModule),
  ],
  controllers: [HistoricController],
  providers: [HistoricService],
  exports: [HistoricService]
})
export class HistoricModule { }
