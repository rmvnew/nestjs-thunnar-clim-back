import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortingType } from 'src/common/Enums';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { Repository } from 'typeorm';
import { ClientFilter } from './dto/client.filter';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {

  private readonly logger = new Logger(ClientService.name)

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) { }

  //^ feito e testado
  async create(createClientDto: CreateClientDto) {

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

    if (!is_registered) {
      throw new NotFoundException(`Cliente não encontrado!`)
    }

    const { client_name, client_is_company, client_cnpj, client_responsible } = updateClientDto

    if (client_is_company && !client_cnpj) {
      throw new BadRequestException(`Para empresa informe o cnpj!`)
    }

    const client = await this.clientRepository.preload({
      client_id: id,
      ...updateClientDto
    })

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


