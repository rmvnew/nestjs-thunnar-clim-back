import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { ClientModule } from './client/client.module';
import { Bootstrap } from './config/bootstrap';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from './config/environments/config.module';
import { SwaggerModule } from './config/swagger/swagger.module';
import { HistoricModule } from './historic/historic.module';
import { EmailModule } from './mail/mail.module';
import { MovementItemsModule } from './movement_items/movement_items.module';
import { MovementModule } from './moviment/movement.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
import { ProviderModule } from './provider/provider.module';
import { UserModule } from './user/user.module';
import { WorkOrderModule } from './work-order/work-order.module';
import { DeviceModule } from './device/device.module';
import { PartsOrServiceModule } from './parts-or-service/parts-or-service.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UserModule,
    DatabaseModule,
    SwaggerModule,
    ProfileModule,
    EmailModule,
    AddressModule,
    ClientModule,
    HistoricModule,
    ProductModule,
    ProviderModule,
    MovementModule,
    MovementItemsModule,
    WorkOrderModule,
    DeviceModule,
    PartsOrServiceModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [

    Bootstrap,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }

  ],
})
export class AppModule { }
