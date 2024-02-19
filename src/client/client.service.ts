import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortingType, TypeDepartments, TypeEctions } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { CreateHistoricDto } from 'src/historic/dto/create-historic.dto';
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

      const is_exists = await this.findByName(client_name.toUpperCase())

      if (is_exists) {
        throw new BadRequestException(`O Cliente já está cadastrado!`)
      }

      if (client_is_company && !client_cnpj) {
        throw new BadRequestException(`Para empresa informe o cnpj!`)
      }

      const client = this.clientRepository.create(createClientDto)

      client.client_name = client_name.toUpperCase()

      client.client_responsible = client_responsible.toUpperCase()

      this.logger.debug('Sub: ', req.user.sub);

      const user = await this.userService.findById(req.user.sub)


      const historic: CreateHistoricDto = {
        historic_department: TypeDepartments.CLIENT.toString(),
        historic_occurrence: TypeEctions.CREATE,
        user: user
      }


      await this.historicService.create(historic)

      return await this.clientRepository.save(client)


    } catch (error) {
      this.logger.error(`Error create client - ${error.message}`)
      throw error
    }

  }

  //^ feito e testado
  async findByName(name: string) {

    try {

      const current_client = await this.clientRepository.createQueryBuilder('client')
        .where('client_name = :name', { name })
        .getOne()

      return current_client

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
        queryBuilder.orderBy('client.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
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

      const current_client = await this.clientRepository.createQueryBuilder('client')
        .leftJoinAndSelect('client.address', 'address')
        .where('client.client_id = :id', { id })
        .getOne()

      if (!current_client) {
        throw new NotFoundException(`Cliente não encontrado!`)
      }

      return current_client

    } catch (error) {
      this.logger.error(`Error: findById - client: ${error.message}`)
      throw error
    }

  }

  //^ feito e testado 
  async update(id: string, updateClientDto: UpdateClientDto) {

    const is_registered = await this.findById(id)
    const current_address = is_registered.address

    if (!is_registered) {
      throw new NotFoundException(`Cliente não encontrado!`)
    }

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

    return this.clientRepository.save(client)
  }

  //^ feito e testado 
  async remove(id: string) {

    const is_registered = await this.findById(id)

    if (!is_registered) {
      throw new NotFoundException(`Cliente não encontrado!`)
    }

    this.clientRepository.remove(is_registered)

  }
}


