import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ISearchParams {
  page: string;
  cat_id: string;
  limit: string;
  [key: string]: string;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API}/api/v1/`,
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => `categories`,
    }),
    getProductsByCatId: builder.query<any, ISearchParams>({
      query: (arg) => {
        return { url: 'products', params: { ...arg } };
      },
    }),
  }),
});

export const { useGetProductsByCatIdQuery, useGetAllCategoriesQuery } =
  productsApi;
