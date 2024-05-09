import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricModule } from 'src/historic/historic.module';
import { Provider } from './entities/provider.entity';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
    HistoricModule
  ],
  controllers: [ProviderController],
  providers: [ProviderService]
})
export class ProviderModule { }
