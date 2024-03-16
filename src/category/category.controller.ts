import { Controller, Get, Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CategoryEntity, CategoryEntityWithAttributes } from './category.types';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  allCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: CategoryEntityWithAttributes })
  CategoryById(@Param('id', ParseIntPipe) id) {
    return this.categoryService.getCategoryById(id);
  }
}
