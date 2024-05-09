import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from 'src/client/client.service';
import { CustomDate } from 'src/common/custom.date';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { WorkOrder } from './entities/work-order.entity';

@Injectable()
export class WorkOrderService {

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
    work_order.create_at = CustomDate.getInstance().getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')
    work_order.update_at = CustomDate.getInstance().getNewDateInTheAmazonTimeZone().date.format('YYYY-MM-DD HH:mm:ss')

    return this.woRepository.save(work_order)
  }

  async findAll() {
    return `This action returns all workOrder`;
  }

  async findById(id: number) {
    return `This action returns a #${id} workOrder`;
  }

  async update(id: number, updateWorkOrderDto: UpdateWorkOrderDto) {
    return `This action updates a #${id} workOrder`;
  }

  async remove(id: number) {
    return `This action removes a #${id} workOrder`;
  }
}
