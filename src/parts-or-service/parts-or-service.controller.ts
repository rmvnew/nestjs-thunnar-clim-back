import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePartsOrServiceDto } from './dto/create-parts-or-service.dto';
import { UpdatePartsOrServiceDto } from './dto/update-parts-or-service.dto';
import { PartsOrServiceService } from './parts-or-service.service';

@Controller('parts-or-service')
export class PartsOrServiceController {
  constructor(private readonly partsOrServiceService: PartsOrServiceService) { }

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
    return this.partsOrServiceService.findById(+id);
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
