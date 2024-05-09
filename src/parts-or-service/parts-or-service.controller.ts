import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartsOrServiceService } from './parts-or-service.service';
import { CreatePartsOrServiceDto } from './dto/create-parts-or-service.dto';
import { UpdatePartsOrServiceDto } from './dto/update-parts-or-service.dto';

@Controller('parts-or-service')
export class PartsOrServiceController {
  constructor(private readonly partsOrServiceService: PartsOrServiceService) {}

  @Post()
  create(@Body() createPartsOrServiceDto: CreatePartsOrServiceDto) {
    return this.partsOrServiceService.create(createPartsOrServiceDto);
  }

  @Get()
  findAll() {
    return this.partsOrServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partsOrServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartsOrServiceDto: UpdatePartsOrServiceDto) {
    return this.partsOrServiceService.update(+id, updatePartsOrServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partsOrServiceService.remove(+id);
  }
}
