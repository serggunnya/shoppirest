import React from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useGetAllCategoriesQuery } from 'store/slices/productSlice';

import AppLayout from '../components/ui/layout/AppLayout';

const Products: React.FC = () => {
  // const { data, isLoading, error } = useGetAllCategoriesQuery({});
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <AppLayout>
      <div>Товары</div>
      {` category Id ${searchParams.get('cat')}`}
    </AppLayout>
  );
};

export default Products;
