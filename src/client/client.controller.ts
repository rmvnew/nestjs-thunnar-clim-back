import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { ClientService } from './client.service';
import { ClientFilter } from './dto/client.filter';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
@ApiTags('Client')
@ApiBearerAuth()


export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota adiciona um novo cliente.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente e Dono]` })

  @ApiBody({
    description: '## Schema padrão para criar cliente.',
    type: CreateClientDto
  })

  async create(
    @Req() req: RequestWithUser,
    @Body() createClientDto: CreateClientDto
  ) {
    return this.clientService.create(createClientDto, req);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota busca todos clientes.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiQuery({ name: 'client_name', required: false, description: '### Este é um filtro opcional!' })
  async findAll(
    @Query() filter: ClientFilter
  ) {
    return this.clientService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota busca um Cliente pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: 'Id do cliente. ' })
  async findOne(@Param('id') id: string) {
    return this.clientService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota atualiza um cliente pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: 'Id do cliente. ' })
  @ApiBody({
    description: '## Schema padrão para atualizar um cliente. ',
    type: UpdateClientDto
  })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientService.update(id, updateClientDto, req);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota habilita e desabilita um cliente pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: '### Id do cliente. ' })
  async changeStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,

  ) {
    return this.clientService.changeStatus(id, req);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota Deleta um cliente pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: '### Id do cliente. ' })
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.clientService.remove(id, req);
  }
}
