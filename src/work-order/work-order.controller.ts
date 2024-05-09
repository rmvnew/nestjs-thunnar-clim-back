import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
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
  create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
    return this.workOrderService.create(createWorkOrderDto);
  }

  @Get()
  findAll() {
    return this.workOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workOrderService.findById(+id);
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
