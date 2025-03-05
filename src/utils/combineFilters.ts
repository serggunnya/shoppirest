import { Prisma } from "@prisma/client";

const combineFilters = (cat_id: number, filters: { [key: string]: any }): Prisma.Sql => {
	const keys = Object.keys(filters);
	const conditions: Prisma.Sql[] = [Prisma.empty];

	for (let i = 0; i < keys.length; i++) {
		const attr = keys[i];

		if (attr !== "price") {
			if (filters[attr]?.type === 0) {
				const query = Prisma.sql`
					(p.properties ->> ${attr})::boolean IN (${Prisma.join(filters[attr].val)})
				`;
				conditions.push(query);
			} else if (filters[attr]?.type === 1) {
				const query = Prisma.sql`
					(p.properties ->> ${attr})::text IN (${Prisma.join(filters[attr].val)})
				`;
				conditions.push(query);
			} else if (filters[attr]?.type === 2) {
				const query = Prisma.sql`
					${
						filters[attr]?.min
							? Prisma.sql`(p.properties ->> ${attr})::int >= ${filters[attr].min}`
							: Prisma.empty
					}
					${
						filters[attr]?.max
							? Prisma.sql`(p.properties ->> ${attr})::int <= ${filters[attr].max}`
							: Prisma.empty
					}
				`;
				conditions.push(query);
			} else {
				const query = Prisma.sql`
					${
						filters[attr]?.min
							? Prisma.sql`(p.properties ->> ${attr})::float >= ${filters[attr].min}`
							: Prisma.empty
					}
					${
						filters[attr]?.max
							? Prisma.sql`(p.properties ->> ${attr})::float <= ${filters[attr].max}`
							: Prisma.empty
					}
				`;
				conditions.push(query);
			}
		}
	}

	return Prisma.sql`
		SELECT id FROM "Product" p where p.cat_id = ${cat_id}
		${filters.price?.min ? Prisma.sql`AND p.price >= ${filters.price.min}` : Prisma.empty}
		${filters.price?.max ? Prisma.sql`AND p.price <= ${filters.price.max}` : Prisma.empty}		
		${Prisma.join(conditions, "AND")}
	`;
};

export default combineFilters;
