import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { FilterWorkOrder } from './dto/workOrder.filter';
import { WorkOrderService } from './work-order.service';

@Controller('work-order')
@ApiTags('Work order')
@ApiBearerAuth()

export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota cria uma nova ordem de serviços.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar uma nova ordem.',
    type: CreateWorkOrderDto
  })
  async create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
    return this.workOrderService.create(createWorkOrderDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca todas Ordens de serviço.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiQuery({ name: 'work_order_responsible', required: false, description: '### Este é um filtro opcional!' })
  async findAll(
    @Query() filter: FilterWorkOrder
  ) {
    return this.workOrderService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    summary: 'Buscar Ordem pelo id',
    description: `# Esta rota busca um ordens de serviço pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id da ordem. ' })
  async findOne(@Param('id') id: string) {
    return this.workOrderService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkOrderDto: UpdateWorkOrderDto) {
    return this.workOrderService.update(+id, updateWorkOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workOrderService.remove(+id);
  }
}
