import { Attribute, Option } from '@prisma/client';

export interface IOptionWithQuantity extends Option {
  quantity: number;
}

export interface IAttributeWithOptions extends Attribute {
  options: IOptionWithQuantity[];
}
