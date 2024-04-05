import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from './../common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'createProduct' })
  create(
    @Payload() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'findAllProducts' })
  findAll(
    @Payload() paginationDto: PaginationDto
  ) {
    return this.productsService.findAll( paginationDto );
  }

  @MessagePattern({ cmd: 'findOneProduct' })
  findOne(
    @Payload('id') id: string
  ) {
    return this.productsService.findOne(+id);
  }

  @MessagePattern({ cmd: 'updateProduct' })
  update(
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: 'removeProduct' })
  remove(
    @Payload('id') id: string
  ) {
    return this.productsService.remove(+id);
  }


  @MessagePattern({ cmd: 'validateProduct' })
  validateProduct(
    @Payload() ids: number[]
  ) {
    return this.productsService.validateProduct( ids );
  }
}
