import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from './../common';

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

    const [ data, totalPages ]: [ any[], number ] = await Promise.all([
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

    if( !product ) throw new NotFoundException(`Product with id ${id} not found`);

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
}
