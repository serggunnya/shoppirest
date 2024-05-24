import React from "react";

import { Box, LinearProgress } from "@mui/material";

import ProductCard from "./ProductCard";
import ProductsListSkeleton from "./ProductsListSkeleton";

interface ProductsListProps {
	products: any;
	isLoading: boolean;
	isFetching: boolean;
}

const ProductsList: React.FC<ProductsListProps> = (props) => {
	const { products, isLoading, isFetching } = props;
	return (
		<Box sx={{ padding: "15px" }}>
			{isLoading ? (
				<ProductsListSkeleton />
			) : (
				products.data.map((p: any) => <ProductCard key={p.id} product={p} />)
			)}
			{isFetching && !isLoading && <LinearProgress color="secondary" />}
		</Box>
	);
};

export default ProductsList;
