import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoricService } from 'src/historic/historic.service';
import { MovementService } from 'src/moviment/movement.service';
import { Repository } from 'typeorm';
import { CreateMovementItemDto } from './dto/create-movement_item.dto';
import { UpdateMovementItemDto } from './dto/update-movement_item.dto';
import { MovementItem } from './entities/movement_item.entity';

@Injectable()
export class MovementItemsService {

  private readonly logger = new Logger(MovementItemsService.name)

  constructor(
    @InjectRepository(MovementItem)
    private readonly movementItemsRepository: Repository<MovementItem>,
    private readonly historicService: HistoricService,
    private readonly movementService: MovementService
  ) { }

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
