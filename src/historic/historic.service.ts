import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortingType, TypeActions, TypeDepartments } from 'src/common/Enums';
import { CustomDate } from 'src/common/custom.date';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { HistoricFilter } from './dto/historic.filter';
import { Historic } from './entities/historic.entity';

@Injectable()
export class HistoricService {

  private readonly logger = new Logger(HistoricService.name)

  constructor(
    @InjectRepository(Historic)
    private readonly historicRepository: Repository<Historic>,
    @Inject(forwardRef(() => UserService))
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
    typeActions: TypeActions,
    details?: string,
    current_user?: UserEntity,

  ) {

    const logged_in_user_id = req ? req.user.sub : null

    const user = await this.userService.findById(logged_in_user_id)

    const historic: CreateHistoricDto = {
      historic_department: typeDepartment,
      historic_occurrence: typeActions,
      historic_details: details,
      user: user ? user : current_user
    }


    await this.create(historic)
  }

  async findAll(filter: HistoricFilter) {


    try {
      const { sort, orderBy, user_name } = filter;

      const queryBuilder = this.historicRepository.createQueryBuilder('hist')
        .leftJoinAndSelect('hist.user', 'user')
        .select([
          'hist.historic_id',
          'hist.historic_date',
          'hist.historic_department',
          'hist.historic_occurrence',
          'hist.historic_details',
          'hist.create_at',
          'hist.update_at',
          'hist.status',
        ]).addSelect([
          'user.user_id',
          'user.user_name',
        ])



      if (user_name) {
        queryBuilder.andWhere(`user.user_name LIKE :user_name`, {
          user_name: `%${user_name}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        queryBuilder.orderBy('hist.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        queryBuilder.orderBy('user.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }


      return CustomPagination.getInstance().getPage(queryBuilder, filter)


    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }

  }


}
