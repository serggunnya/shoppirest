import React from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useGetProductsByCatIdQuery } from 'store/slices/productSlice';

import AppLayout from '../components/ui/layout/AppLayout';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queries: any = {};
  for (let entry of searchParams.entries()) {
    queries[entry[0]] = entry[1];
  }

  const { data, isLoading, error } = useGetProductsByCatIdQuery(queries);

  return (
    <AppLayout>
      <div>Товары</div>
      <ul>
        {isLoading ? (
          <div>...загрузка</div>
        ) : (
          data.data.map((p: any) => <li key={p.id}>{p.name}</li>)
        )}
      </ul>
    </AppLayout>
  );
};

export default Products;
