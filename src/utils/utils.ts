interface IQuery {
  [key: string]: string | number;
}

export const toWhere = (cat_id: number, filters: IQuery): any => {
  const result: any = { cat_id };

  if (Object.keys(filters).length) {
    const entries = Object.entries(filters);
    const queries = [];
    for (const props of entries) {
      const [attr, values] = props;

      const properties = {
        some: {
          attribute_alias: { equals: attr },
          AND: { option: { alias: { in: String(values).split(';') } } },
        },
      };
      queries.push({ properties });
    }
    result.OR = queries;
  }

  return result;
};
