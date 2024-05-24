import React, { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { ISearchParams, useGetCategoryByIdQuery } from "@/store/slices/productSlice";

import FilterDrawer from "./FilterDrawer";
import FilterPropertyItem from "./FilterPropertyItem";
import { mapAttributesToFilterState } from "./mapAttributesToFilterState";

export interface ProductFilterProps {
	doFilter: (queries: ISearchParams) => void;
}

export interface IFilterFormState {
	[attr_alias: string]: { [option_alias: string]: boolean };
}

export const FilterList: React.FC<ProductFilterProps> = (props) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [filterOpen, setFilterOpen] = useState<boolean>(false);

	const { data, isLoading, error } = useGetCategoryByIdQuery(Number(searchParams?.get("cat_id")));

	const filterOpenHandler = () => {
		setFilterOpen(!filterOpen);
	};

	const formMethods = useForm<IFilterFormState>({ defaultValues: {} });
	const { control, handleSubmit, reset } = formMethods;

	useEffect(() => {
		if (!isLoading) {
			reset(mapAttributesToFilterState(data.attributes, searchParams));
		}
	}, [isLoading]);

	const submit = (filterState: IFilterFormState) => {
		/**
 * 1) transform filterState to queries object;
 * 2) update searchParams
 * 3) update queries state for invoking new request products
 *
 * const updatedQueries: ISearchParams = { };
	 setSearchParams(updatedQueries);
	 props.doFilter(updatedQueries);
 */
	};

	return (
		<Box sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}>
			<FilterDrawer drawerWidth={240} filterOpen={filterOpen} handleFilterClose={filterOpenHandler}>
				<div>
					{isLoading ? (
						<div>...Loading</div>
					) : (
						<FormProvider {...formMethods}>
							<div>
								{data.name}
								<div className="property-list">
									{data.attributes.map((attr: any) => {
										return <FilterPropertyItem key={attr.id} attribute={attr} />;
									})}
								</div>
								<button onClick={handleSubmit(submit)}>Filter</button>
							</div>
						</FormProvider>
					)}
				</div>
			</FilterDrawer>
		</Box>
	);
};
