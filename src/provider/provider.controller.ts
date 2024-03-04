import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderFilter } from './dto/provider.filter';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderService } from './provider.service';

@Controller('provider')
@ApiTags('Provider')
@ApiBearerAuth()


export class ProviderController {
  constructor(private readonly providerService: ProviderService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota adiciona um novo produto.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar produto.',
    type: CreateProviderDto
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createProviderDto: CreateProviderDto
  ) {
    return this.providerService.create(
      createProviderDto,
      req
    );
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota busca todos fornecedores.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiQuery({ name: 'provider_name', required: false, description: '### Este é um filtro opcional!' })
  async findAll(filter: ProviderFilter) {
    return this.providerService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota busca um fornecedor pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id do fornecedor. ' })
  async findById(@Param('id') id: string) {
    return this.providerService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota atualiza um fornecedor pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: 'Id do fornecedor. ' })
  @ApiBody({
    description: '## Schema padrão para atualizar um fornecedor. ',
    type: UpdateProviderDto
  })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto
  ) {
    return this.providerService.update(id, updateProviderDto, req);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota habilita e desabilita um fornecedor pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do fornecedor. ' })
  async changeStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,

  ) {
    return this.providerService.changeStatus(id, req);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota Deleta um fornecedor pelo Id.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do fornecedor. ' })
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.providerService.remove(id, req);
  }
}
