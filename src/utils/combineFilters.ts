import { Prisma } from "@prisma/client";

import {
	AttributeType,
	IFacets,
	IFilters,
	MultiValue,
	NumericValue,
} from "../product/interfaces/product.interface";

const createMultiValueCondition = (
	attr: string,
	filterValue: MultiValue,
	castType: Prisma.Sql,
): Prisma.Sql => {
	return Prisma.sql`(p.properties ->> ${attr})::${castType} IN (${Prisma.join(filterValue.val)})`;
};

const createNumericCondition = (
	attr: string,
	filterValue: NumericValue,
	castType: Prisma.Sql,
): Prisma.Sql => {
	return Prisma.sql`
		${
			filterValue?.min
				? Prisma.sql`(p.properties ->> ${attr})::${castType} >= ${filterValue.min}`
				: Prisma.empty
		}
		${
			filterValue?.max
				? Prisma.sql`(p.properties ->> ${attr})::${castType} <= ${filterValue.max}`
				: Prisma.empty
		}
	`;
};

const createPriceCondition = (filterValue: NumericValue): Prisma.Sql => {
	return Prisma.sql`
		${filterValue?.min ? Prisma.sql`AND p.price >= ${filterValue.min}` : Prisma.empty}
		${filterValue?.max ? Prisma.sql`AND p.price <= ${filterValue.max}` : Prisma.empty}
	`;
};

const combineFilters = (catId: number, filters: IFilters, attrMap: IFacets): Prisma.Sql => {
	try {
		const keys = Object.keys(filters);

		const conditions: Prisma.Sql[] = [Prisma.empty];
		for (const attr of keys) {
			if (attr === "price") continue;

			const value = filters[attr];

			switch (attrMap[attr]?.type) {
				case AttributeType.BOOLEAN:
					conditions.push(
						createMultiValueCondition(attr, value as MultiValue, Prisma.sql`boolean`),
					);
					break;
				case AttributeType.TEXT:
					conditions.push(createMultiValueCondition(attr, value as MultiValue, Prisma.sql`text`));
					break;
				case AttributeType.INTEGER:
					conditions.push(createNumericCondition(attr, value as NumericValue, Prisma.sql`int`));
					break;
				default:
					conditions.push(createNumericCondition(attr, value as NumericValue, Prisma.sql`float`));
					break;
			}
		}

		return Prisma.sql`
      SELECT id FROM "Product" p 
      WHERE p.cat_id = ${catId}
      ${createPriceCondition(filters.price as NumericValue)} 
			${Prisma.join(conditions, " AND ")}
    `;
	} catch (error) {
		console.error("Error in combineFilters:", error);
		throw error;
	}
};

export default combineFilters;
