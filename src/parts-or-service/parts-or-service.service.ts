import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceService } from 'src/device/device.service';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreatePartsOrServiceDto } from './dto/create-parts-or-service.dto';
import { UpdatePartsOrServiceDto } from './dto/update-parts-or-service.dto';
import { PartsOrService } from './entities/parts-or-service.entity';

@Injectable()
export class PartsOrServiceService {

  constructor(
    @InjectRepository(PartsOrService)
    private readonly posRepository: Repository<PartsOrService>,
    private readonly deviceService: DeviceService,
    private readonly productService: ProductService
  ) { }


  async create(createPartsOrServiceDto: CreatePartsOrServiceDto) {
    return 'This action adds a new partsOrService';
  }

  async findAll() {
    return `This action returns all partsOrService`;
  }

  async findById(id: number) {
    return `This action returns a #${id} partsOrService`;
  }

  async update(id: number, updatePartsOrServiceDto: UpdatePartsOrServiceDto) {
    return `This action updates a #${id} partsOrService`;
  }

  async remove(id: number) {
    return `This action removes a #${id} partsOrService`;
  }
}
