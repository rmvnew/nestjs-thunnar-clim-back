import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeActions, TypeDepartments } from 'src/common/Enums';
import { CustomDate } from 'src/common/custom.date';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { Historic } from './entities/historic.entity';

@Injectable()
export class HistoricService {

  constructor(
    @InjectRepository(Historic)
    private readonly historicRepository: Repository<Historic>,
    private readonly userService: UserService
  ) { }

  async create(createHistoricDto: CreateHistoricDto) {

    const { user } = createHistoricDto

    const historic = this.historicRepository.create(createHistoricDto)


    historic.historic_date = CustomDate.getInstance()
      .getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')

    historic.user = user



    return this.historicRepository.save(historic)
  }


  async historicRegister(
    req: RequestWithUser,
    typeDepartment: TypeDepartments,
    typeActions: TypeActions
  ) {

    const logged_in_user_id = req.user.sub

    const user = await this.userService.findById(logged_in_user_id)

    const historic: CreateHistoricDto = {
      historic_department: typeDepartment,
      historic_occurrence: typeActions,
      user: user
    }


    await this.create(historic)
  }

  findAll() {
    return this.historicRepository.find()
  }


}
