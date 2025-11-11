export interface Category {
	id: number;
	slug: string;
	name: string;
	description: string | null;
	parent_id: number | null;
	path: string;
	image: string | null;	
	created_at: Date;
	updated_at: Date;
}

export interface CategoryExtended extends Category {
	level: number | null;
	type: "self" | "ancestor" | "child";
}

export interface CategoryResponse extends CategoryExtended {	
	breadcrumbs: CategoryExtended[];
	children?: CategoryExtended[];
}