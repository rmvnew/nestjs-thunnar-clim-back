import { PartialType } from '@nestjs/swagger';
import { CreateMovementItemDto } from './create-movement_item.dto';

export class UpdateMovementItemDto extends PartialType(CreateMovementItemDto) {}
