import { Prisma } from '@prisma/client';

export const products: Prisma.ProductCreateInput[] = [
  {
    name: 'Xiaomi redmi 7A 2/16Гб',
    price: 7999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Xiaomi redmi A2+ 3/64Гб',
    price: 6999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Xiaomi redmi 10C 3/64Гб',
    price: 10999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Xiaomi redmi 12C 4/128Гб',
    price: 9999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Xiaomi redmi note 12S 8/256Гб',
    price: 20999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Iphone 12 Pro 4/64Гб',
    price: 82000,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Iphone 13 4/128Гб',
    price: 77999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Iphone 14 Pro 6/256Гб',
    price: 130599,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Sumsung galaxy A54 6/128Гб',
    price: 45499,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Sumsung galaxy S21 8/256Гб',
    price: 45499,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Sumsung galaxy S23 ultra 12/256Гб',
    price: 108999,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Poco X5 Pro 5G 8/256Гб',
    price: 45499,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Poco F5 Pro 5G 6/256Гб',
    price: 39499,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Poco F5 Pro 5G 6/256Гб',
    price: 39499,
    category: { connect: { id: 1 } },
  },
  {
    name: 'Realme 11 Pro+ 12/512Гб',
    price: 43499,
    category: { connect: { id: 1 } },
  },
];

export const Product_properties: Prisma.Product_propertyCreateInput[] = [
  {
    product: { connect: { id: 1 } },
    attribute: { connect: { alias: 'smph_ram' } },
    option: { connect: { id: 4 } },
  },
  {
    product: { connect: { id: 1 } },
    attribute: { connect: { alias: 'smph_storage' } },
    option: { connect: { id: 1 } },
  },
  {
    product: { connect: { id: 2 } },
    attribute: { connect: { alias: 'smph_ram' } },
    option: { connect: { id: 5 } },
  },
  {
    product: { connect: { id: 2 } },
    attribute: { connect: { alias: 'smph_storage' } },
    option: { connect: { id: 3 } },
  },
];
