import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { ProductEntity } from './ProductEntity';
import { IQueries } from './product.types';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  allProducts(@Query() queries: IQueries) {
    return this.productService.getProducts(queries);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  productByid(@Param('id', ParseIntPipe) id) {
    return this.productService.getProductById(id);
  }
}
