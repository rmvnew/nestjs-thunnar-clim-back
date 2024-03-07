import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { MovementService } from './movement.service';


@Controller('movement')
@ApiTags('Movement')
@ApiBearerAuth()

export class MovementController {
  constructor(private readonly movementService: MovementService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota adiciona uma nova movementação de materiais/produtos.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar movementação.',
    type: CreateMovementDto
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createMovementDto: CreateMovementDto
  ) {
    return this.movementService.create(createMovementDto, req);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca todos movementos.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  // @ApiQuery({ name: 'client_name', required: false, description: '### Este é um filtro opcional!' })
  async findAll() {
    return this.movementService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca um movemento pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id do movemento. ' })
  async findOne(
    @Param('id') id: string
  ) {
    return this.movementService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota atualiza um movemento pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id do movemento. ' })
  @ApiBody({
    description: '## Schema padrão para atualizar um movemento. ',
    type: UpdateMovementDto
  })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto
  ) {
    return this.movementService.update(id, updateMovementDto, req);
  }


}
