import { Injectable } from '@nestjs/common';
import { CreatePartsOrServiceDto } from './dto/create-parts-or-service.dto';
import { UpdatePartsOrServiceDto } from './dto/update-parts-or-service.dto';

@Injectable()
export class PartsOrServiceService {
  create(createPartsOrServiceDto: CreatePartsOrServiceDto) {
    return 'This action adds a new partsOrService';
  }

  findAll() {
    return `This action returns all partsOrService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} partsOrService`;
  }

  update(id: number, updatePartsOrServiceDto: UpdatePartsOrServiceDto) {
    return `This action updates a #${id} partsOrService`;
  }

  remove(id: number) {
    return `This action removes a #${id} partsOrService`;
  }
}
