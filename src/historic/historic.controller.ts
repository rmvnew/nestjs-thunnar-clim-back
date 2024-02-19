import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { HistoricService } from './historic.service';

@ApiExcludeController()
@Controller('historic')

export class HistoricController {
  constructor(private readonly historicService: HistoricService) { }

  @Post()
  create(@Body() createHistoricDto: CreateHistoricDto) {
    return this.historicService.create(createHistoricDto);
  }

  @Get()
  findAll() {
    return this.historicService.findAll();
  }


}
