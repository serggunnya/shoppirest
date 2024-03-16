import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { IAttributeWithOptions, IOptionWithQuantity } from './filter.types';

@Injectable()
export class FilterService {
  constructor(private prisma: PrismaService) {}

  async getAllFilters() {
    const attributes = await this.prisma.attribute.findMany({
      where: { cat_id: 1 },
    });

    const optionsWithQuantity: IOptionWithQuantity[] = await this.prisma
      .$queryRaw`
    SELECT o.id, o.attr_id, o.alias, o.value, COUNT(p.id) AS quantity
    FROM "Product" p 
    JOIN "Product_property" pp on pp.product_id = p.id
    JOIN "Option" o ON pp.option_id  = o.id
    where p.cat_id = ${1}
    GROUP BY o.id
    `;

    const attrIdMap = attributes.reduce((map, attr: IAttributeWithOptions) => {
      return !map.has(attr.id) ? (map.set(attr.id, attr), map) : map;
    }, new Map());

    optionsWithQuantity.forEach((opt: IOptionWithQuantity) => {
      if (attrIdMap.has(opt.attr_id)) {
        const attr: IAttributeWithOptions = attrIdMap.get(opt.attr_id);
        if (attr.options === undefined) attr.options = [];
        attr.options.push(opt);
      }
    });

    return attributes;
  }
}
