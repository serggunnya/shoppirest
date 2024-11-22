import { Prisma } from "@prisma/client";

const combineFilters = (filters: { [key: string]: string[] }): Prisma.Sql => {
	const props: [string, string[]][] = Object.entries(filters);
	if (props.length === 0) return Prisma.empty;

	const conditions: Prisma.Sql[] = [];
	for (let [attr, val] of props) {
		const query = Prisma.sql`p.id = ANY (
		SELECT prod_id FROM "Product_property" pp WHERE 
		pp.attr_alias=${attr} AND pp.option_alias IN (${Prisma.join(val)}))`;
		conditions.push(query);
	}

	return Prisma.sql`AND ${Prisma.join(conditions, " AND ")}`;
};

export default combineFilters;
