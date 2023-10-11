export const toWhere = (filters: { [key: string]: string | number }) => {
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
  return { OR: queries };
};
