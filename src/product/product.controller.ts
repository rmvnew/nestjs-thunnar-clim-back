import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilter } from './dto/product.filter';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth()

export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota adiciona um novo produto.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente e Dono]` })

  @ApiBody({
    description: '## Schema padrão para criar produto.',
    type: CreateProductDto
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productService.create(createProductDto, req);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota busca todos clientes.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiQuery({ name: 'product_name', required: false, description: '### Este é um filtro opcional!' })
  findAll(
    @Query() filter: ProductFilter
  ) {
    return this.productService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_USER_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota busca um produto pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: 'Id do cliente. ' })
  findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota atualiza um produto pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: 'Id do produto. ' })
  @ApiBody({
    description: '## Schema padrão para atualizar um produto. ',
    type: UpdateProductDto
  })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto, req);
  }


  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota habilita e desabilita um produto pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: '### Id do produto. ' })
  async changeStatus(
    @Req() req: RequestWithUser,
    @Param('id') id: string,

  ) {
    return this.productService.changeStatus(id, req);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_MANAGER_OWNER))
  @ApiOperation({
    description: `# Esta rota Deleta um produto pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Gerente,Dono]` })
  @ApiParam({ name: 'id', description: '### Id do produto. ' })
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.productService.remove(id, req);
  }
}
