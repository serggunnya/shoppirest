import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { ProductEntity } from './ProductEntity';
import { ProductService } from './product.service';
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
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: ProductEntity })
  productByid(@Param('id', ParseIntPipe) id) {
    return this.productService.getProductById(id);
  }
}
