import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from 'src/client/client.service';
import { TypeActions, TypeDepartments, TypeMessage } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { HistoricService } from 'src/historic/historic.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateMovimentDto } from './dto/create-moviment.dto';
import { UpdateMovimentDto } from './dto/update-moviment.dto';
import { Moviment } from './entities/moviment.entity';

@Injectable()
export class MovimentService {

  private readonly logger = new Logger(MovimentService.name)

  constructor(
    @InjectRepository(Moviment)
    private readonly movimentRepository: Repository<Moviment>,
    private readonly historicService: HistoricService,
    private readonly userService: UserService,
    private readonly clientService: ClientService

  ) { }


  async create(createMovimentDto: CreateMovimentDto, req: RequestWithUser) {

    try {

      const { client_id, user_id } = createMovimentDto

      const moviment = this.movimentRepository.create()

      const user = await this.userService.findById(user_id)
      const client = await this.clientService.findById(client_id)

      moviment.user = user
      moviment.client = client

      const moviment_saved = await this.movimentRepository.save(moviment)

      this.historicService.historicRegister(
        req,
        TypeDepartments.MOVIMENT,
        TypeActions.CREATE,
        `Registro manipulado -> id: ${moviment_saved.moviment_id} - Nome: ${moviment_saved.client.client_name}`
      )

      return moviment_saved

    } catch (error) {
      this.logger.error(`moviment - create: ${error.message}`)
      throw error
    }
  }

  async findAll() {
    return this.movimentRepository.find()
  }

  async findById(id: string) {
    try {

      const moviment = await this.movimentRepository.findOne({
        where: {
          moviment_id: id
        }, relations: ['user', 'client']
      })

      if (!moviment) {
        throw new NotFoundException(`O movimento ${TypeMessage.NOT_FOUND}`)
      }

      return moviment

    } catch (error) {
      this.logger.error(`Moviment - findById: ${error.message}`)
      throw error
    }
  }

  async update(id: string, updateMovimentDto: UpdateMovimentDto, req: RequestWithUser) {

    try {

      await this.findById(id)

      const { client_id, user_id, moviment_condition } = updateMovimentDto

      const moviment = await this.movimentRepository.preload({
        moviment_id: id,
        ...updateMovimentDto
      })

      if (user_id) {

        const user = await this.userService.findById(user_id)
        moviment.user = user

      }

      if (client_id) {

        const client = await this.clientService.findById(client_id)
        moviment.client = client
      }

      if (moviment_condition) {
        moviment.moviment_condition = moviment_condition
      }

      const moviment_saved = await this.movimentRepository.save(moviment)

      this.historicService.historicRegister(
        req,
        TypeDepartments.MOVIMENT,
        TypeActions.UPDATE,
        `Registro manipulado -> id: ${moviment_saved.moviment_id} - Nome: ${moviment_saved.client.client_name}`
      )

      return moviment_saved

    } catch (error) {
      this.logger.error(`Moviment - update: ${error.message}`)
      throw error
    }

  }


}
