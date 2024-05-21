import React, { useState } from "react";

import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { FilterList } from "@/components/filterList/FilterList";
import ProductsList from "@/components/productsList/ProductsList";
import AppLayout from "@/components/ui/layout/AppLayout";
import { ISearchParams, useGetProductsByCatIdQuery } from "@/store/slices/productSlice";

const drawerWidth = 240;

const Products: React.FC = (props) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const mapQueries = (searchParams: URLSearchParams) => {
		const queries: ISearchParams = { page: "1", cat_id: "1" };
		searchParams.forEach((value, key) => (queries[key] = value));
		return queries;
	};

	const [queries, setQueries] = useState<ISearchParams>(mapQueries(searchParams));

	const { data, isLoading, isFetching, isSuccess, error } = useGetProductsByCatIdQuery(queries);

	const filterHandler = (queries: ISearchParams) => setQueries((prev) => ({ ...queries }));

	const pages = Array.from(new Array(3), (_: number, i: number) => i + 1);

	const changePage = (page: number) => () => {
		setSearchParams((prev) => ({ ...prev, page: `${page}` }));
		setQueries((prev) => ({ ...prev, page: `${page}` }));
	};

	return (
		<AppLayout>
			<Box component="main" sx={{ width: { sm: `calc(100% - ${240}px)` } }}>
				<ProductsList products={data} isLoading={isLoading} isFetching={isFetching} />

				<FilterList doFilter={filterHandler} />

				{pages.map((p) => (
					<button key={p} onClick={changePage(p)}>
						{p}
					</button>
				))}
			</Box>
		</AppLayout>
	);
};

export default Products;
