import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from 'src/address/address.module';
import { Address } from 'src/address/entities/address.entity';
import { EmailModule } from 'src/mail/mail.module';
import { ProfileModule } from 'src/profile/profile.module';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      Address
    ]),
    EmailModule,
    AddressModule,
    ProfileModule,
    ProfileModule

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
