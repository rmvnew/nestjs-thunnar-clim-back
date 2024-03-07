import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CreateMovimentDto } from './dto/create-moviment.dto';
import { UpdateMovimentDto } from './dto/update-moviment.dto';
import { MovimentService } from './moviment.service';

@Controller('moviment')
@ApiTags('Moviment')
@ApiBearerAuth()

export class MovimentController {
  constructor(private readonly movimentService: MovimentService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota adiciona uma nova movimentação de materiais/produtos.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar movimentação.',
    type: CreateMovimentDto
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createMovimentDto: CreateMovimentDto
  ) {
    return this.movimentService.create(createMovimentDto, req);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca todos movimentos.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  // @ApiQuery({ name: 'client_name', required: false, description: '### Este é um filtro opcional!' })
  async findAll() {
    return this.movimentService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca um movimento pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id do movimento. ' })
  async findOne(
    @Param('id') id: string
  ) {
    return this.movimentService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota atualiza um movimento pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id do movimento. ' })
  @ApiBody({
    description: '## Schema padrão para atualizar um movimento. ',
    type: UpdateMovimentDto
  })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateMovimentDto: UpdateMovimentDto
  ) {
    return this.movimentService.update(id, updateMovimentDto, req);
  }


}
