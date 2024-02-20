import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { HistoricFilter } from './dto/historic.filter';
import { HistoricService } from './historic.service';

@Controller('historic')
@ApiTags('Historic')
@ApiBearerAuth()

export class HistoricController {
  constructor(private readonly historicService: HistoricService) { }

  @Post()
  @PublicRoute()
  @ApiExcludeEndpoint()
  create(@Body() createHistoricDto: CreateHistoricDto) {
    return this.historicService.create(createHistoricDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  async findAll(
    @Query() filter: HistoricFilter
  ) {
    return this.historicService.findAll(filter);
  }


}
