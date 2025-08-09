export interface ICategory {
	id: number;
	slug: string;
	parent_id: number | null;
	is_active: boolean;
	children?: ICategory[];
	created_at: Date;
	updated_at: Date;
}
