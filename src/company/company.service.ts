import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {

  private readonly logger = new Logger(CompanyService.name)

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }


  async create(createCompanyDto: CreateCompanyDto) {

    const existingCompany = await this.companyRepository.find()

    if (existingCompany.length > 0) {
      throw new BadRequestException('Já existe uma empresa cadastrada.');
    }


    const {

      company_name,
      trade_name,
      company_responsible: responsible,

    } = createCompanyDto

    const company = this.companyRepository.create(createCompanyDto)

    company.company_name = company_name.toUpperCase().trim()
    company.trade_name = trade_name !== undefined ? trade_name.toUpperCase().trim() : '-'
    company.company_responsible = responsible !== undefined ? responsible.toUpperCase().trim() : '-'

    return this.companyRepository.save(company)


  }

  async findAll() {
    return `This action returns all company`;
  }

  async findById(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  async remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
