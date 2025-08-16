export interface Category {
	id: number;
	slug: string;
	parent_id: number | null;
	is_active: boolean;
	children?: Category[];
	created_at: Date;
	updated_at: Date;
}
