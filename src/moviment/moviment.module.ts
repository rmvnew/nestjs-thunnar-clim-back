import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { HistoricModule } from 'src/historic/historic.module';
import { UserModule } from 'src/user/user.module';
import { Moviment } from './entities/moviment.entity';
import { MovimentController } from './moviment.controller';
import { MovimentService } from './moviment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Moviment]),
    HistoricModule,
    UserModule,
    ClientModule
  ],
  controllers: [MovimentController],
  providers: [MovimentService]
})
export class MovimentModule { }
