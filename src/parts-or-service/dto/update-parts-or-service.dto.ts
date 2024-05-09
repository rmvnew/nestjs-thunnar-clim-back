import { PartialType } from '@nestjs/swagger';
import { CreatePartsOrServiceDto } from './create-parts-or-service.dto';

export class UpdatePartsOrServiceDto extends PartialType(CreatePartsOrServiceDto) {}
