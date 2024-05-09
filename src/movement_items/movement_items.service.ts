import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeActions, TypeDepartments } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { HistoricService } from 'src/historic/historic.service';
import { MovementService } from 'src/moviment/movement.service';
import { ProductService } from 'src/product/product.service';
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
    private readonly movementService: MovementService,
    private readonly productService: ProductService
  ) { }

  async create(createMovementItemDto: CreateMovementItemDto, req: RequestWithUser) {

    const { movement_id, product_id } = createMovementItemDto

    const movement = await this.movementService.findById(movement_id)
    const product = await this.productService.findById(product_id)

    const moviment_items = this.movementItemsRepository.create(createMovementItemDto)
    moviment_items.product = product
    moviment_items.movement = movement

    const movement_items_saved = await this.movementItemsRepository.save(moviment_items)

    this.historicService.historicRegister(
      req,
      TypeDepartments.MOVEMENT_ITENS,
      TypeActions.CREATE,
      `
      Registro manipulado -> id: ${movement_items_saved.movement_items_id} - 
      Movement_item: ${movement_items_saved.product.product_name} -
      Quantity: ${movement_items_saved.movement_items_quantity}
      `
    )

    return movement_items_saved

  }

  async findAll() {
    return this.movementItemsRepository.find()
  }

  async findOne(id: string) {
    return this.movementItemsRepository.findOne({
      where: {
        movement_items_id: id
      }
    })
  }

  async update(
    id: string,
    updateMovementItemDto: UpdateMovementItemDto
  ) {


    const is_regiostered = await this.findOne(id)

    if (is_regiostered) {

    }


  }

  async remove(id: string) {
    return `This action removes a #${id} movementItem`;
  }
}
