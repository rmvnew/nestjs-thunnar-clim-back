import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricModule } from 'src/historic/historic.module';
import { UserModule } from 'src/user/user.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    HistoricModule,
    UserModule
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule { }
