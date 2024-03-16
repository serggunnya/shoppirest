import { ApiProperty } from '@nestjs/swagger';
import { Attribute, Category, Option } from '@prisma/client';

export interface IOptionWithQuantity extends Option {
  quantity: number;
}

export interface IAttributeWithOptions extends Attribute {
  options: IOptionWithQuantity[];
}

export class CategoryEntity implements Category {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  createdAt: Date;
}

export class AttributeEntity implements IAttributeWithOptions {
  @ApiProperty()
  id: number;

  @ApiProperty()
  cat_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  options: OptionEntity[];

  @ApiProperty()
  createdAt: Date;
}

export class OptionEntity implements IOptionWithQuantity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  attr_id: number;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  createdAt: Date;
}

export class CategoryEntityWithAttributes extends CategoryEntity {
  @ApiProperty({ isArray: true })
  attributes: AttributeEntity;
}
