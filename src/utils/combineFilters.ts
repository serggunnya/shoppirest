import { Prisma } from "@prisma/client";

import {
	AttributeType,
	FacetsMap,
	FiltersRequestData,
	RangeValueRequest,
	SelectValueRequest,
} from "../product/interfaces/product.interface";

// Создание запроса фильтрации
const combineFilters = (
	categoryId: number,
	filtersRequestData: FiltersRequestData,
	attributeMap: FacetsMap,
): Prisma.Sql => {
	try {
		const keys = Object.keys(filtersRequestData);
		const conditions: Prisma.Sql[] = [Prisma.empty];

		for (const alias of keys) {
			const type = attributeMap[alias]?.type;
			const data = filtersRequestData[alias];

			if (type === "NUMERIC") {
				conditions.push(createRangeCondition(alias, data as RangeValueRequest));
			} else {
				conditions.push(createSelectCondition(alias, type, data as SelectValueRequest));
			}
		}

		return Prisma.sql`
      SELECT id FROM "products" p 
      WHERE p.category_id = ${categoryId} 
			AND p.is_active = true AND p.stock > 0
			${conditions.length > 0 ? Prisma.join(conditions, "") : Prisma.empty}	
    `;
	} catch (error) {
		console.error("Error in combineFilters:", error);
		throw error;
	}
};

const createSelectCondition = (
	alias: string,
	type: AttributeType,
	data: SelectValueRequest,
): Prisma.Sql => {
	let castType = Prisma.empty;

	if (type === "BOOLEAN") {
		castType = Prisma.sql`boolean`;
	} else if (type === "NUMBER") {
		castType = Prisma.sql`numeric`;
	} else {
		castType = Prisma.sql`text`;
	}

	return Prisma.sql`
	 AND (p.properties -> ${alias} ->>'value')::${castType} IN (${Prisma.join(data.val)})`;
};

const createRangeCondition = (alias: string, data: RangeValueRequest): Prisma.Sql => {
	if (alias === "price") {
		return Prisma.sql`
			${data?.min ? Prisma.sql` AND p.price >= ${data?.min}` : Prisma.empty}
			${data?.max ? Prisma.sql` AND p.price <= ${data?.max}` : Prisma.empty}
		`;
	}

	const castType = Prisma.sql`numeric`;

	return Prisma.sql`
		${
			data?.min
				? Prisma.sql` AND (p.properties->${alias}->>'value')::${castType} >= ${data.min}`
				: Prisma.empty
		}
		${
			data?.max
				? Prisma.sql` AND (p.properties->${alias}->>'value')::${castType} <= ${data.max}`
				: Prisma.empty
		}
	`;
};

export default combineFilters;
