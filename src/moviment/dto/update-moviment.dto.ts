import { PartialType } from '@nestjs/swagger';
import { CreateMovimentDto } from './create-moviment.dto';

export class UpdateMovimentDto extends PartialType(CreateMovimentDto) {}
