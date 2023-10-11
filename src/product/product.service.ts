import { Injectable } from '@nestjs/common';
import { toWhere } from 'utils/utils';
import { PrismaService } from '../prisma/prisma.service';
import { IQueries } from './product.types';

const util = require('util');

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts({ page = 1, limit = 5, ...filters }: IQueries) {
    const props = Object.keys(filters);
    const filtered = props.length ? toWhere(filters) : undefined;
    const pageOffset = page > 0 ? limit * (page - 1) : 0;

    // console.log(util.inspect(filtered, false, null, true));

    const [total, data] = await Promise.all([
      this.prisma.product.count({
        where: filtered,
      }),
      this.prisma.product.findMany({
        where: filtered,
        take: limit,
        skip: pageOffset,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        limit,
        currentPage: page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: number) {
    return await this.prisma.product.findMany({
      include: { properties: { include: { option: true } } },
      where: { id },
    });
  }
}
