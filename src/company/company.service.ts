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

    const existingCompany = await this.findCompany()

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


  async findCompany(): Promise<Company[]> {
    return this.companyRepository.find()
  }



  async update(updateCompanyDto: UpdateCompanyDto) {

    const {
      address,
      company_cnpj,
      company_email,
      company_name,
      company_phone,
      company_responsible: responsible,
      municipal_registration,
      state_registration,
      trade_name
    } = updateCompanyDto

    const [company] = await this.findCompany()

    if (address) {

      const current_address = company.address
      current_address.address_city = address.address_city
      current_address.address_district = address.address_district
      current_address.address_home_number = address.address_home_number
      current_address.address_state = address.address_state
      current_address.address_street = address.address_street
      current_address.address_zipcode = address.address_zipcode

      company.address = current_address

    }

    company.company_cnpj = company_cnpj
    company.company_email = company_email
    company.company_name = company_name.toUpperCase()
    company.company_phone = company_phone
    company.company_responsible = responsible.toUpperCase()

    if (municipal_registration) {
      company.municipal_registration = municipal_registration
    }

    if (state_registration) {
      company.state_registration = state_registration
    }

    if (trade_name) {
      company.trade_name = trade_name.toUpperCase()
    }


    return this.companyRepository.save(company)

  }


}
