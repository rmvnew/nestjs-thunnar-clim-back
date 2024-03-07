import { Injectable } from '@nestjs/common';
import { CreateMovementItemDto } from './dto/create-movement_item.dto';
import { UpdateMovementItemDto } from './dto/update-movement_item.dto';

@Injectable()
export class MovementItemsService {
  create(createMovementItemDto: CreateMovementItemDto) {
    return 'This action adds a new movementItem';
  }

  findAll() {
    return `This action returns all movementItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movementItem`;
  }

  update(id: number, updateMovementItemDto: UpdateMovementItemDto) {
    return `This action updates a #${id} movementItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} movementItem`;
  }
}
