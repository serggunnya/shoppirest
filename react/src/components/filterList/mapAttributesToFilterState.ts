import { IFilterFormState } from "./FilterList";

export const mapAttributesToFilterState = (attributes: any[], searchParams: URLSearchParams): IFilterFormState => {
	const queries: IFilterFormState = {};
	searchParams.forEach((value, key) => {
		if (key !== "page" && key !== "cat_id") {
			queries[key] = {};
			value.split(",").forEach((opt) => (queries[key][opt] = true));
		}
	});

	const filterState: IFilterFormState = {};
	if (attributes !== undefined) {
		for (let i = 0; i < attributes.length; i++) {
			const attr_alias = attributes[i].alias;
			filterState[attr_alias] = {};
			if (attributes[i].options?.length) {
				for (let j = 0; j < attributes[i].options.length; j++) {
					const option_alias = attributes[i]?.options[j]?.alias;
					filterState[attr_alias][option_alias] = queries?.[attr_alias]?.[option_alias] ? true : false;
				}
			}
		}
	}
	return filterState;
};
