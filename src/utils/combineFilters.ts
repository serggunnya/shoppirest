import { Prisma } from "@prisma/client";

import {
	AttributeType,
	IAttributeMap,
	ISearchFilters,
	RangeValue,
	SelectValue,
} from "../product/interfaces/product.interface";

/**
 * Создание запроса фильтрации
 * @param {number} categoryId - id категории
 * @param {ISearchFilters} searchFilters - фильтры
 * @param {IAttributeMap} attributeMap - атрибуты
 * @returns {Prisma.Sql} - запрос фильтрации
 */
const combineFilters = (
	categoryId: number,
	searchFilters: ISearchFilters,
	attributeMap: IAttributeMap,
): Prisma.Sql => {
	try {
		const keys = Object.keys(searchFilters);
		const conditions: Prisma.Sql[] = [Prisma.empty];

		for (const alias of keys) {
			const type = attributeMap[alias]?.type;
			const data = searchFilters[alias];

			if (type === AttributeType.NUMERIC) {
				const condition = createRangeCondition(alias, data as RangeValue);
				conditions.push(condition);
			} else {
				const condition = createSelectCondition(alias, data as SelectValue, type);
				conditions.push(condition);
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
	data: SelectValue,
	type: AttributeType,
): Prisma.Sql => {
	let castType = Prisma.empty;

	if (type === AttributeType.BOOLEAN) {
		castType = Prisma.sql`boolean`;
	} else if (type === AttributeType.NUMBER) {
		castType = Prisma.sql`numeric`;
	} else {
		castType = Prisma.sql`text`;
	}

	return Prisma.sql`
	 AND (p.properties -> ${alias} ->>'value')::${castType} IN (${Prisma.join(data.val)})`;
};

const createRangeCondition = (alias: string, data: RangeValue): Prisma.Sql => {
	if (alias === "price") {
		return Prisma.sql`
			${data?.min ? Prisma.sql` AND p.price >= ${data.min}` : Prisma.empty}
			${data?.max ? Prisma.sql` AND p.price <= ${data.max}` : Prisma.empty}
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
