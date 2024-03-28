import { Box } from '@mui/material';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsByCatIdQuery } from 'store/slices/productSlice';
import { FilterList } from '../components/filterList/FilterList';
import ProductsList from '../components/productsList/ProductsList';
import AppLayout from '../components/ui/layout/AppLayout';

const drawerWidth = 240;

const Products: React.FC = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queries: any = {};
  for (let entry of searchParams.entries()) {
    queries[entry[0]] = entry[1];
  }

  const { data, isLoading, error } = useGetProductsByCatIdQuery(queries);

  return (
    <AppLayout>
      <Box
        component="main"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <ProductsList products={data} isLoading={isLoading} />
        <FilterList
          categoryId={Number(searchParams?.get('cat_id'))}
          queries={queries}
        />
      </Box>
    </AppLayout>
  );
};

export default Products;
