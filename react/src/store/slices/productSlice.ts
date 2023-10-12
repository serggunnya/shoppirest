import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API}/api/v1/`,
  }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => `products`,
    }),
    getAllCategories: builder.query({
      query: () => `categories`,
    }),
  }),
});

export const { useGetAllProductsQuery, useGetAllCategoriesQuery } = productsApi;
