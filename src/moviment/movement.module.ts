import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { HistoricModule } from 'src/historic/historic.module';
import { UserModule } from 'src/user/user.module';
import { Movement } from './entities/movement.entity';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    HistoricModule,
    UserModule,
    ClientModule
  ],
  controllers: [MovementController],
  providers: [MovementService]
})
export class MovementModule { }
