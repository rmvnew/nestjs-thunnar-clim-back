import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoricService } from 'src/historic/historic.service';
import { Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProviderService {

  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly historicService: HistoricService
  ) { }

  async create(createProviderDto: CreateProviderDto) {
    return 'This action adds a new provider';
  }

  async findByNameAndCnpj(name: string, cnpj: string) {

  }
  async findAll() {
    return `This action returns all provider`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  async remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
