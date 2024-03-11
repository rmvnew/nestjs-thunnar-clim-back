import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from 'src/client/client.service';
import { SortingType, TypeActions, TypeDepartments, TypeMessage } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { HistoricService } from 'src/historic/historic.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementFilter } from './dto/movement.filter';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Movement } from './entities/movement.entity';


@Injectable()
export class MovementService {

  private readonly logger = new Logger(MovementService.name)

  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    private readonly historicService: HistoricService,
    private readonly userService: UserService,
    private readonly clientService: ClientService

  ) { }


  async create(createMovementDto: CreateMovementDto, req: RequestWithUser) {

    try {

      const { client_id, user_id } = createMovementDto

      const movement = this.movementRepository.create()

      const user = await this.userService.findById(user_id)
      const client = await this.clientService.findById(client_id)

      movement.user = user
      movement.client = client

      const movement_saved = await this.movementRepository.save(movement)

      this.historicService.historicRegister(
        req,
        TypeDepartments.MOVEMENT,
        TypeActions.CREATE,
        `Registro manipulado -> id: ${movement_saved.movement_id} - Nome: ${movement_saved.client.client_name}`
      )

      return movement_saved

    } catch (error) {
      this.logger.error(`movement - create: ${error.message}`)
      throw error
    }
  }

  async findAll(filter: MovementFilter) {


    try {
      const { sort, orderBy, movement_condition, showActives } = filter;

      const queryBuilder = this.movementRepository.createQueryBuilder('mov')
        .leftJoinAndSelect('mov.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('mov.client', 'client')
        .select([
          'mov.movement_id',
          'mov.movement_condition',
          'mov.status',
          'mov.create_at',
          'mov.update_at',
          'user.user_id',
          'user.user_name',
          'user.status',
          'profile.profile_name',
          'client.client_id',
          'client.client_name',
          'client.client_cnpj',
          'client.client_cpf',
          'client.client_phone',
          'client.status',

        ])

      if (showActives === "true") {
        queryBuilder.andWhere('mov.status = true');
      } else if (showActives === "false") {
        queryBuilder.andWhere('mov.status = false');
      }

      if (movement_condition) {
        queryBuilder.andWhere(`mov.movement_condition = :movement_condition`, {
          movement_condition: movement_condition
        });
      }

      if (orderBy == SortingType.DATE) {
        queryBuilder.orderBy('mov.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        queryBuilder.orderBy('mov.update_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      return CustomPagination.getInstance().getPage(queryBuilder, filter)


    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }

  async findById(id: string) {
    try {

      const movement = this.movementRepository.createQueryBuilder('mov')
        .leftJoinAndSelect('mov.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('mov.client', 'client')
        .select([
          'mov.movement_id',
          'mov.movement_condition',
          'mov.status',
          'mov.create_at',
          'mov.update_at',
          'user.user_id',
          'user.user_name',
          'user.status',
          'profile.profile_name',
          'client.client_id',
          'client.client_name',
          'client.client_cnpj',
          'client.client_cpf',
          'client.client_phone',
          'client.status',

        ]).getOne()

      if (!movement) {
        throw new NotFoundException(`O movemento ${TypeMessage.NOT_FOUND}`)
      }

      return movement

    } catch (error) {
      this.logger.error(`Movement - findById: ${error.message}`)
      throw error
    }
  }

  async update(id: string, updateMovementDto: UpdateMovementDto, req: RequestWithUser) {

    try {

      await this.findById(id)

      const { client_id, user_id, movement_condition } = updateMovementDto

      const movement = await this.movementRepository.preload({
        movement_id: id,
        ...updateMovementDto
      })

      if (user_id) {

        const user = await this.userService.findById(user_id)
        movement.user = user

      }

      if (client_id) {

        const client = await this.clientService.findById(client_id)
        movement.client = client
      }

      if (movement_condition) {
        movement.movement_condition = movement_condition
      }

      const movement_saved = await this.movementRepository.save(movement)

      this.historicService.historicRegister(
        req,
        TypeDepartments.MOVEMENT,
        TypeActions.UPDATE,
        `Registro manipulado -> id: ${movement_saved.movement_id} - Nome: ${movement_saved.client.client_name}`
      )

      return movement_saved

    } catch (error) {
      this.logger.error(`Movement - update: ${error.message}`)
      throw error
    }

  }


}
