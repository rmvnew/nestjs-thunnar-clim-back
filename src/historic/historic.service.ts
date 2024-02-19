import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomDate } from 'src/common/custom.date';
import { Repository } from 'typeorm';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { Historic } from './entities/historic.entity';

@Injectable()
export class HistoricService {

  constructor(
    @InjectRepository(Historic)
    private readonly historicRepository: Repository<Historic>
  ) { }

  async create(createHistoricDto: CreateHistoricDto) {

    const { user } = createHistoricDto

    const historic = this.historicRepository.create(createHistoricDto)


    historic.historic_date = CustomDate.getInstance()
      .getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')

    historic.user = user



    return this.historicRepository.save(historic)
  }

  findAll() {
    return this.historicRepository.find()
  }


}
