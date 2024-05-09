import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortingType, TypeActions, TypeDepartments } from 'src/common/Enums';
import { RequestWithUser } from 'src/common/interfaces/user.request.interface';
import { CustomPagination } from 'src/common/pagination/custon.pagination';
import { HistoricService } from 'src/historic/historic.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilter } from './dto/product.filter';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {

  private readonly logger = new Logger(ProductService.name)

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly historicService: HistoricService
  ) { }


  async create(createProductDto: CreateProductDto, req: RequestWithUser) {

    const { product_name, can_be_returned: returnd, product_barcode: barcode } = createProductDto

    await this.findByNameAndBarcode(product_name.toUpperCase(), barcode)

    const can_be_returnd = returnd === undefined ? false : returnd


    const product = this.productRepository.create(createProductDto)

    product.product_name = product_name.toUpperCase()

    product.product_can_be_returned = can_be_returnd

    const product_saved = await this.productRepository.save(product)

    this.historicService.historicRegister(
      req,
      TypeDepartments.PRODUCT,
      TypeActions.CREATE,
      `Registro manipulado -> id: ${product_saved.product_id} - Nome: ${product_saved.product_name}`
    )

    return product_saved
  }

  async findByNameAndBarcode(name: string, barcode: string) {

    try {

      const product = await this.productRepository.findOne({
        where: {
          product_barcode: barcode
        }
      })

      if (product) {
        if (product.product_name !== name) {
          throw new BadRequestException(`O código de barras já está cadastrado para outro produto!`)
        } else {
          throw new BadRequestException(`O produto já está cadastrado!`)
        }
      }

    } catch (error) {
      this.logger.error(`Product - findByNameAndBarcode: ${error.message}`)
      throw error
    }

  }

  async findAll(filter: ProductFilter) {

    try {
      const { sort, orderBy, product_name, showActives } = filter;

      const queryBuilder = this.productRepository.createQueryBuilder('prod')

      if (showActives === "true") {
        queryBuilder.andWhere('prod.status = true');
      } else if (showActives === "false") {
        queryBuilder.andWhere('prod.status = false');
      }

      if (product_name) {
        queryBuilder.andWhere(`prod.product_name LIKE :product_name`, {
          product_name: `%${product_name}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        queryBuilder.orderBy('prod.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        queryBuilder.orderBy('prod.product_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      return CustomPagination.getInstance().getPage(queryBuilder, filter)

    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }

  }

  async findById(id: string) {
    return this.productRepository.findOne({
      where: {
        product_id: id
      }
    })
  }

  async update(id: string, updateProductDto: UpdateProductDto, req: RequestWithUser) {

    try {

      const is_registered = await this.findById(id)

      if (!is_registered) {
        throw new NotFoundException(`Produto não encontrado!`)
      }

      const { product_name } = updateProductDto

      const product = await this.productRepository.preload({
        product_id: id,
        ...updateProductDto
      })

      if (product_name) {

        product.product_name = product_name.toUpperCase()

      }

      const product_saved = await this.productRepository.save(product)

      this.historicService.historicRegister(
        req,
        TypeDepartments.PRODUCT,
        TypeActions.UPDATE,
        `Registro manipulado -> id: ${product_saved.product_id} - Nome: ${product_saved.product_name}`
      )

      return product_saved

    } catch (error) {

      this.logger.error(`Error - update client: ${error.message}`)
      throw error
    }
  }


  async changeStatus(id: string, req: RequestWithUser) {
    try {

      const is_registered = await this.findById(id)

      if (!is_registered) {
        throw new NotFoundException(`Produto não encontrado!`)
      }

      const { status } = is_registered

      is_registered.status = status ? false : true

      this.productRepository.save(is_registered)

      this.historicService.historicRegister(
        req,
        TypeDepartments.PRODUCT,
        is_registered.status ? TypeActions.ACTIVATED : TypeActions.DISABLED,
        `Registro manipulado -> id: ${is_registered.product_id} - Nome: ${is_registered.product_name}`
      )

    } catch (error) {
      this.logger.error(`Error changeStatus product: ${error.message}`)
      throw error
    }
  }

  async remove(id: string, req: RequestWithUser) {
    try {

      const is_registered = await this.findById(id)

      if (!is_registered) {
        throw new NotFoundException(`Produto não encontrado!`)
      }

      this.productRepository.remove(is_registered)

      this.historicService.historicRegister(
        req,
        TypeDepartments.PRODUCT,
        TypeActions.UPDATE,
        `Registro manipulado -> id: ${is_registered.product_id} - Nome: ${is_registered.product_name}`
      )


    } catch (error) {
      this.logger.error(`Error delete product: ${error.message}`)
      throw error
    }
  }

}
