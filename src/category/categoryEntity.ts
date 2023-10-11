import { ApiProperty } from '@nestjs/swagger';
import { Category, Attribute, Option } from '@prisma/client';

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

export class AttributeEntity implements Attribute {
  @ApiProperty()
  id: number;

  @ApiProperty()
  cat_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  createdAt: Date;
}

export class OptionEntity implements Option {
  @ApiProperty()
  id: number;

  @ApiProperty()
  attr_id: number;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  createdAt: Date;
}

export class AttributeEntityWithOptions extends AttributeEntity {
  @ApiProperty({ isArray: true })
  options: OptionEntity;
}

export class CategoryEntityWithAttributes extends CategoryEntity {
  @ApiProperty({ isArray: true })
  attributes: AttributeEntityWithOptions;
}
