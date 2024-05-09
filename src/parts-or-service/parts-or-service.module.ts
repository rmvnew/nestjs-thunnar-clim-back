import { Module } from '@nestjs/common';
import { PartsOrServiceService } from './parts-or-service.service';
import { PartsOrServiceController } from './parts-or-service.controller';

@Module({
  controllers: [PartsOrServiceController],
  providers: [PartsOrServiceService]
})
export class PartsOrServiceModule {}
