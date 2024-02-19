import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from './entities/historic.entity';
import { HistoricController } from './historic.controller';
import { HistoricService } from './historic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Historic])
  ],
  controllers: [HistoricController],
  providers: [HistoricService],
  exports: [HistoricService]
})
export class HistoricModule { }
