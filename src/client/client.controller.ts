import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
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
    description: `# Esta rota adiciona um novo usuário.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente e Dono]` })

  @ApiBody({
    description: '## Schema padrão para criar usuário.',
    type: CreateClientDto
  })
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  async findAll(
    @Query() filter: ClientFilter
  ) {
    return this.clientService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
