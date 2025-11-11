import { ApiProperty } from "@nestjs/swagger";

export class CategoryDoc {
	@ApiProperty()
	id: number;
	
	@ApiProperty()
	parent_id: number | null;
	
	@ApiProperty()
	slug: string;

	@ApiProperty()
	path: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string | null;
		
	@ApiProperty()
	image: string;	

	@ApiProperty()
	createdAt: Date;
}


export class CategoryExtDoc extends  CategoryDoc {
	@ApiProperty()
	level: number | null;

	@ApiProperty()
	type: "self" | "ancestor" | "child";
}


export class CategoryDataResponseDoc{
	@ApiProperty({isArray: true, type: CategoryExtDoc})
	breadcrumbs: CategoryExtDoc;

	@ApiProperty({isArray: true, type: CategoryExtDoc})
	children?: CategoryExtDoc;
}


export class AttributeSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	alias: string;

	@ApiProperty()
	type: number;

	@ApiProperty()
	createdAt: Date;
}
