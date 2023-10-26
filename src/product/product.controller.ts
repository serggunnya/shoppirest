import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { ProductEntity } from './ProductEntity';
import { ISearchParams } from './product.types';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  getProductsByCatId(@Query() searchParams: ISearchParams) {
    return this.productService.getProductsByCatId(searchParams);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  productByid(@Param('id', ParseIntPipe) id) {
    return this.productService.getProductById(id);
  }
}
