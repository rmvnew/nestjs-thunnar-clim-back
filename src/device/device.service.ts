import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeActions, TypeDepartments } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { HistoricService } from 'src/historic/historic.service';
import { WorkOrderService } from 'src/work-order/work-order.service';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {

  private readonly logger = new Logger(DeviceService.name)


  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly historicService: HistoricService,
    private readonly work_order_service: WorkOrderService
  ) { }


  async create(createDeviceDto: CreateDeviceDto, req: RequestWithUser) {

    const { work_order_id } = createDeviceDto

    const current_work_order = await this.work_order_service.findById(work_order_id)

    const device = this.deviceRepository.create(createDeviceDto)
    device.workOrder = current_work_order

    const device_saved = await this.deviceRepository.save(device)

    this.historicService.historicRegister(
      req,
      TypeDepartments.DEVICE,
      TypeActions.CREATE,
      `Registro manipulado -> id: ${device_saved.device_id} - Número de série: ${device_saved.device_serial} `
    )

    return device_saved
  }

  findAll() {
    return `This action returns all device`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
