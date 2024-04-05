import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaClient, product } from '@prisma/client';
import { PaginationDto } from './../common';
import { RpcException } from '@nestjs/microservices';
// import { Product } from './entities';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
    
  }
  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto
    });
  }

  async findAll( paginationDto: PaginationDto ) {

    const { page, limit } = paginationDto;

    const [ data, totalPages ]: [ product[], number ] = await Promise.all([
      await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      }),
      await this.product.count({
        where: { available: true }
      }),

    ]);


    const lastPage = Math.ceil(totalPages / limit);

    return {
      data,
      meta: {
        total: totalPages,
        page,
        lastPage 
      }
    }
  }

  async findOne(id: number) {

    const product = await this.product.findFirst({
      where: { id, available: true }
    });

    if( !product ) throw new RpcException({ 
      message: `Product with id ${id} not found`,
      status: HttpStatus.BAD_REQUEST
    });

    return product;
  }

  async update( id: number, updateProductDto: UpdateProductDto ) {

    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);
    
    const update = await this.product.update({
      where: { id },
      data
    });

    return update;

  }

  async remove(id: number) {
    
    await this.findOne(id);
    
    const remove = await this.product.update({
      where: { id },
      data: { available: false }
    });

    return remove;

  }


  async validateProduct( ids: number[] ) {

    ids = Array.from(new Set(ids));

    const produst = await this.product.findMany({
      where: { id: { in: ids } }
    });

    if( produst.length !== ids.length ) throw new RpcException({
      message: 'Some products were not found',
      status: HttpStatus.BAD_REQUEST
    });

    return produst;


  }
}
