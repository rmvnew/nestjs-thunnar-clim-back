import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortingType, TypeActions, TypeDepartments, TypeMessage } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { HistoricService } from 'src/historic/historic.service';
import { Not, Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderFilter } from './dto/provider.filter';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProviderService {

  private readonly logger = new Logger(ProviderService.name)

  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly historicService: HistoricService
  ) { }

  // ? feito falta testar
  async create(createProviderDto: CreateProviderDto, req: RequestWithUser) {

    try {

      const { provider_name: name, provider_cnpj: cnpj, provider_responsible } = createProviderDto

      const is_registered = await this.providerIsRegistered(name, cnpj)


      if (is_registered) {
        throw new BadRequestException(`O fornecedor já está cadastrado!\nVerifique o cnpj.`)
      }

      const provider = this.providerRepository.create(createProviderDto)

      provider.provider_name = name.toUpperCase()
      provider.provider_responsible = provider_responsible.toUpperCase()


      const saved_provider = await this.providerRepository.save(provider)

      this.historicService.historicRegister(
        req,
        TypeDepartments.PRODUCT,
        TypeActions.CREATE,
        `Registro manipulado -> id: ${saved_provider.provider_id} - Nome: ${saved_provider.provider_name}`
      )

      return saved_provider

    } catch (error) {
      this.logger.error(`Error create provider - ${error.message}`)
      throw error
    }

  }

  // ? feito falta testar
  async providerIsRegistered(name: string, cnpj: string) {

    try {
      const provider = await this.providerRepository
        .createQueryBuilder("provider")
        .where("provider.provider_cnpj = :cnpj", { cnpj })
        .getOne();

      if (provider) {
        if (provider.provider_name !== name) {
          throw new BadRequestException(`O CNPJ: ${cnpj} já está cadastrado para outra empresa.`);
        } else {
          throw new BadRequestException(`O fornecedor com nome ${name} e CNPJ ${cnpj} já está cadastrado.`);
        }
      }

      return null;
    } catch (error) {

      this.logger.error(`Error create provider - ${error.message}`)
      throw error

    }


  }

  // ? feito falta testar
  async findAll(filter: ProviderFilter) {

    try {

      const { orderBy, provider_name, showActives, sort } = filter;


      const queryBuilder = this.providerRepository.createQueryBuilder('prov')
        .leftJoinAndSelect('prov.address', 'address')

      if (showActives === "true") {
        queryBuilder.andWhere('prov.status = true');
      } else if (showActives === "false") {
        queryBuilder.andWhere('prov.status = false');
      }

      if (provider_name) {
        queryBuilder.andWhere(`prov.provider_name LIKE :provider_name`, {
          provider_name: `%${provider_name}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        queryBuilder.orderBy('prov.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        queryBuilder.orderBy('prov.provider_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      return CustomPagination.getInstance().getPage(queryBuilder, filter)


    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }

  // ? feito falta testar
  async findById(id: string) {
    try {
      const provider = await this.providerRepository.findOne({
        where: {
          provider_id: id,
          status: Not(false)
        }
      })

      if (!provider) {
        throw new NotFoundException(`O fornecedor ${TypeMessage.NOT_FOUND}`)
      }

      return provider

    } catch (error) {
      this.logger.error(`Provider - findById: ${error.message}`)
      throw error
    }
  }

  // ? feito falta testar
  async update(id: string, updateProviderDto: UpdateProviderDto, req: RequestWithUser) {

    try {

      const is_registered = await this.findById(id)

      if (!is_registered) {
        throw new NotFoundException(`Fornecedor não encontrado!`)
      }

      const current_address = is_registered.address

      const { address, provider_name: name, provider_responsible } = updateProviderDto

      const provider = await this.providerRepository.preload({
        provider_id: id,
        ...updateProviderDto
      })

      if (address) {
        current_address.address_zipcode = address.address_zipcode
        current_address.address_city = address.address_city
        current_address.address_district = address.address_district
        current_address.address_state = address.address_state
        current_address.address_street = address.address_street
        current_address.address_home_number = address.address_home_number
        provider.address = current_address
      }

      if (name) {
        provider.provider_name = name.toUpperCase()
      }

      if (provider_responsible) {
        provider.provider_responsible = provider_responsible.toUpperCase()
      }

      const saved_provider = await this.providerRepository.save(provider)

      this.historicService.historicRegister(
        req,
        TypeDepartments.PROVIDER,
        TypeActions.UPDATE,
        `Registro manipulado -> id: ${saved_provider.provider_id} - Nome: ${saved_provider.provider_name}`
      )


      return saved_provider

    } catch (error) {
      this.logger.error(`Error update provider - ${error.message}`)
      throw error
    }



  }

  async changeStatus(id: string, req: RequestWithUser) {

    const is_registered = await this.providerRepository.findOne({
      where: {
        provider_id: id
      }
    })

    if (!is_registered) {
      throw new NotFoundException(`Fornecedor não encontrado!`)
    }

    const { status } = is_registered

    is_registered.status = status ? false : true

    const saved_provider = await this.providerRepository.save(is_registered)

    this.historicService.historicRegister(
      req,
      TypeDepartments.PROVIDER,
      TypeActions.UPDATE,
      `Registro manipulado -> id: ${saved_provider.provider_id} - Nome: ${saved_provider.provider_name}`
    )

    return saved_provider

  }

  async remove(id: string, req: RequestWithUser) {

    const provider = await this.providerRepository.findOne({
      where: {
        provider_id: id,

      }, relations: ['address']
    });


    if (!provider) {
      throw new NotFoundException(`Fornecedor não encontrado!`)
    }

    const saved_provider = await this.providerRepository.delete(provider.provider_id)

    this.historicService.historicRegister(
      req,
      TypeDepartments.PROVIDER,
      TypeActions.UPDATE,
      `Registro manipulado -> id: ${provider.provider_id} - Nome: ${provider.provider_name}`
    )

    return saved_provider

  }
}
