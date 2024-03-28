import React from 'react';

import { Box } from '@mui/material';
import ProductCard from './ProductCard';
import ProductsListSkeleton from './ProductsListSkeleton';

interface ProductsListProps {
  isLoading: boolean;
  products: any;
}

const ProductsList: React.FC<ProductsListProps> = ({ isLoading, products }) => {
  return (
    <Box sx={{ padding: '15px' }}>
      {isLoading ? (
        <ProductsListSkeleton />
      ) : (
        products.data.map((p: any) => <ProductCard key={p.id} product={p} />)
      )}
    </Box>
  );
};

export default ProductsList;
