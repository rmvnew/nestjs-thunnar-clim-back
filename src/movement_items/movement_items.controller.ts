import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CreateMovementItemDto } from './dto/create-movement_item.dto';
import { UpdateMovementItemDto } from './dto/update-movement_item.dto';
import { MovementItemsService } from './movement_items.service';

@Controller('movement-items')
@ApiTags('Movement Items')
@ApiBearerAuth()


export class MovementItemsController {
  constructor(private readonly movementItemsService: MovementItemsService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota adiciona um novo item na movementação.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar movementação.',
    type: CreateMovementItemDto
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createMovementItemDto: CreateMovementItemDto
  ) {
    return this.movementItemsService.create(createMovementItemDto, req);
  }

  @Get()
  findAll() {
    return this.movementItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementItemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovementItemDto: UpdateMovementItemDto) {
    return this.movementItemsService.update(id, updateMovementItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementItemsService.remove(id);
  }
}
