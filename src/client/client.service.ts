import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortingType, TypeActions, TypeDepartments, TypeMessage } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { HistoricService } from 'src/historic/historic.service';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ClientFilter } from './dto/client.filter';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {

  private readonly logger = new Logger(ClientService.name)

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly historicService: HistoricService,
    private readonly userService: UserService
  ) { }

  //^ feito e testado
  async create(createClientDto: CreateClientDto, req: RequestWithUser) {

    try {

      const { client_name, client_is_company, client_cnpj, client_responsible } = createClientDto

      await this.findByNameAndCnpj(client_name.toUpperCase(), client_cnpj)

      if (client_is_company && !client_cnpj) {
        throw new BadRequestException(`Para empresa informe o cnpj!`)
      }

      const client = this.clientRepository.create(createClientDto)

      client.client_name = client_name.toUpperCase()

      client.client_responsible = client_responsible.toUpperCase()

      const client_saved = await this.clientRepository.save(client)

      this.historicService.historicRegister(
        req,
        TypeDepartments.CLIENT,
        TypeActions.CREATE,
        `Registro manipulado -> id: ${client_saved.client_id} - Nome: ${client_saved.client_name}`
      )

      return client_saved

    } catch (error) {
      this.logger.error(`Error create client - ${error.message}`)
      throw error
    }

  }

  //^ feito e testado
  async findByNameAndCnpj(name: string, cnpj: string) {

    try {

      const current_client = await this.clientRepository.findOne({
        where: {
          client_cnpj: cnpj
        }
      })

      if (current_client) {
        if (current_client.client_name !== name) {
          throw new BadRequestException(`O CNPJ: ${cnpj} já está cadastrado para outra empresa.`);
        } else {
          throw new BadRequestException(`O Cliente já está cadastrado!!`)
        }
      }

    } catch (error) {
      this.logger.error(`Client - findByName: ${error.message}`);

      throw error;
    }

  }

  //^ feito e testado
  async findAll(filter: ClientFilter) {

    try {
      const { sort, orderBy, client_name, showActives } = filter;

      const queryBuilder = this.clientRepository.createQueryBuilder('client')
        .leftJoinAndSelect('client.address', 'address')

      if (showActives === "true") {
        queryBuilder.andWhere('client.status = true');
      } else if (showActives === "false") {
        queryBuilder.andWhere('client.status = false');
      }

      if (client_name) {
        queryBuilder.andWhere(`client.client_name LIKE :client_name`, {
          client_name: `%${client_name}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        queryBuilder.orderBy('client.created_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        queryBuilder.orderBy('client.client_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      return CustomPagination.getInstance().getPage(queryBuilder, filter)


    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }


  }

  //^ feito e testado 
  async findById(id: string) {

    try {

      const current_client = await this.clientRepository.findOne({
        where: {
          client_id: id
        }, relations: ['address']
      })

      if (!current_client) {
        throw new NotFoundException(`O Cliente ${TypeMessage.NOT_FOUND}`)
      }

      return current_client

    } catch (error) {
      this.logger.error(`Error: findById - client: ${error.message}`)
      throw error
    }

  }

  //^ feito e testado 
  async update(id: string, updateClientDto: UpdateClientDto, req: RequestWithUser) {

    try {

      const is_registered = await this.findById(id)

      if (!is_registered) {
        throw new NotFoundException(`Cliente não encontrado!`)
      }
      const current_address = is_registered.address

      const { client_name, client_is_company, client_cnpj, client_responsible, address } = updateClientDto

      if (client_is_company && !client_cnpj) {
        throw new BadRequestException(`Para empresa informe o cnpj!`)
      }

      const client = await this.clientRepository.preload({
        client_id: id,
        ...updateClientDto
      })

      if (address) {
        current_address.address_zipcode = address.address_zipcode
        current_address.address_city = address.address_city
        current_address.address_district = address.address_district
        current_address.address_state = address.address_state
        current_address.address_street = address.address_street
        current_address.address_home_number = address.address_home_number
        client.address = current_address
      }

      if (client_name) {
        client.client_name = client_name.toUpperCase()
      }

      if (client_responsible) {
        client.client_responsible = client_responsible.toUpperCase()
      }

      const client_saved = await this.clientRepository.save(client)

      this.historicService.historicRegister(
        req,
        TypeDepartments.CLIENT,
        TypeActions.UPDATE,
        `Registro manipulado -> id: ${client_saved.client_id} - Nome: ${client_saved.client_name}`
      )

      return client_saved

    } catch (error) {

      this.logger.error(`Error - update client: ${error.message}`)
      throw error
    }

  }

  //^ feito e testado 
  async changeStatus(id: string, req: RequestWithUser) {

    const is_registered = await this.clientRepository.findOne({
      where: {
        client_id: id
      }
    })

    if (!is_registered) {
      throw new NotFoundException(`Cliente não encontrado!`)
    }

    const { status } = is_registered

    is_registered.status = status ? false : true

    this.historicService.historicRegister(
      req,
      TypeDepartments.CLIENT,
      is_registered.status ? TypeActions.ACTIVATED : TypeActions.DISABLED,
      `Registro manipulado -> id: ${is_registered.client_id} - Nome: ${is_registered.client_name}`
    )

    this.clientRepository.save(is_registered)

  }

  //^ feito e testado 
  async remove(id: string, req: RequestWithUser) {

    const is_registered = await this.findById(id)

    if (!is_registered) {
      throw new NotFoundException(`Cliente não encontrado!`)
    }


    this.historicService.historicRegister(
      req,
      TypeDepartments.CLIENT,
      TypeActions.DELETE,
      `Registro manipulado -> id: ${is_registered.client_id} - Nome: ${is_registered.client_name}`
    )

    this.clientRepository.remove(is_registered)

  }
}


