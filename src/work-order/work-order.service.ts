import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from 'src/client/client.service';
import { CustomDate } from 'src/common/custom.date';
import { SortingType } from 'src/common/Enums';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { FilterWorkOrder } from './dto/workOrder.filter';
import { WorkOrder } from './entities/work-order.entity';

@Injectable()
export class WorkOrderService {

  private readonly logger = new Logger(WorkOrderService.name)

  constructor(
    @InjectRepository(WorkOrder)
    private readonly woRepository: Repository<WorkOrder>,
    private readonly clientService: ClientService,
    private readonly userService: UserService
  ) { }

  async create(createWorkOrderDto: CreateWorkOrderDto) {

    const { client_id, user_id, work_order_responsible: responsible } = createWorkOrderDto

    const client = await this.clientService.findById(client_id)
    const user = await this.userService.findById(user_id)
    let order_number = 0

    const lastOrder = await this.woRepository.find({
      order: {
        work_order_number: "DESC"
      },
      take: 1
    })

    if (lastOrder[0] === null || lastOrder[0] === undefined || lastOrder.length === 0) {
      order_number = 1
    } else {
      order_number = lastOrder[0].work_order_number + 1
    }


    const work_order = this.woRepository.create(createWorkOrderDto)
    work_order.work_order_is_open = true
    work_order.client = client
    work_order.user = user
    work_order.work_order_number = order_number
    work_order.work_order_responsible = responsible.toUpperCase()
    work_order.work_order_initial_date = CustomDate.getInstance().getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')
    work_order.work_order_initial_expected_date = CustomDate.getInstance().getFinalDateorder().sql_date
    work_order.status = true
    work_order.created_at = CustomDate.getInstance().getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')
    work_order.updated_at = CustomDate.getInstance().getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')

    return this.woRepository.save(work_order)
  }

  async findAll(filter: FilterWorkOrder) {
    try {
      const { sort, orderBy, work_order_responsible: responsible, showActives } = filter;

      const queryBuilder = this.woRepository.createQueryBuilder('wo')
        .leftJoinAndSelect('wo.devices', 'devices')
        .leftJoinAndSelect('wo.client', 'client')
        .leftJoinAndSelect('wo.user', 'user')
        .select([
          'wo.work_order_id',
          'wo.work_order_number',
          'wo.work_order_value',
          'wo.work_order_initial_date',
          'wo.work_order_initial_expected_date',
          'wo.work_order_responsible',
          'wo.created_at',
          'wo.updated_at',
          'client.client_id',
          'client.client_name',
          'client.client_phone',
          'user.user_id',
          'user.user_name'
        ]).addSelect('devices')


      if (showActives === "true") {
        queryBuilder.andWhere('wo.status = true');
      } else if (showActives === "false") {
        queryBuilder.andWhere('wo.status = false');
      }

      if (responsible) {
        queryBuilder.andWhere(`wo.work_order_responsible LIKE :responsible`, {
          responsible: `%${responsible}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        queryBuilder.orderBy('wo.created_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        queryBuilder.orderBy('wo.product_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      return CustomPagination.getInstance().getPage(queryBuilder, filter)

    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }

  async findById(id: string) {
    try {

      const res = await this.woRepository.createQueryBuilder("work_order")
        .leftJoinAndSelect("work_order.client", "client")
        .leftJoinAndSelect("work_order.user", "user")
        .select([
          "work_order.work_order_id",
          "work_order.work_order_number",
          "work_order.work_order_value",
          "work_order.work_order_initial_date",
          "work_order.work_order_initial_expected_date",
          "work_order.work_order_initial_end_date",
          "work_order.work_order_responsible",
          "work_order.created_at",
          "work_order.updated_at",
          "client.client_id",
          "client.client_name",
          "client.client_phone",
          "user.user_id",
          "user.user_name"
        ])
        .where("work_order.work_order_id = :id", { id })
        .getOne();


      if (!res) {
        throw new NotFoundException(`A ordem não foi encontrada!`)
      }

      return res

    } catch (error) {
      this.logger.error(`findById error: ${error.message}`, error.stack)
      throw error
    }
  }

  async update(id: string, updateWorkOrderDto: UpdateWorkOrderDto) {



    const is_registered = await this.findById(id)

    if (!is_registered) {
      throw new NotFoundException(`Ordem de serviço não encontrada!`)
    }

    const { client_id, user_id, work_order_responsible: responsible } = updateWorkOrderDto

    const work_order = await this.woRepository.preload({
      work_order_id: id,
      ...updateWorkOrderDto
    })



    if (client_id) {
      const client = await this.clientService.findById(client_id)

      if (!client) {
        throw new NotFoundException(`Cliente não encontrado!`)
      }

      work_order.client = client
    }


    if (user_id) {
      const user = await this.userService.findById(user_id)

      if (!user) {
        throw new NotFoundException(`Usuário não encontrado!`)

      }
      work_order.user = user
    }

    if (responsible) {
      work_order.work_order_responsible = responsible.toUpperCase()

    }

    work_order.updated_at = CustomDate.getInstance().getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')

    return this.woRepository.save(work_order)
  }

  async remove(id: string) {
    return `This action removes a #${id} workOrder`;
  }
}
