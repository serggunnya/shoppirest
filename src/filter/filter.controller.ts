import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FilterService } from './filter.service';

@ApiTags('Product filter')
@Controller('filter')
export class FilterController {
  constructor(private filterService: FilterService) {}

  @Get('/')
  @ApiOkResponse()
  allFilters() {
    return this.filterService.getAllFilters();
  }

  // @Get(':catId')
  // @ApiOkResponse({ type: CategoryEntityWithAttributes })
  // CategoryById(@Param('catId', ParseIntPipe) catId) {
  //   return this.categoryService.getCategoryById(catId);
  // }
}
