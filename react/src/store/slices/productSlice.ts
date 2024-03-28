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
    baseUrl: `${import.meta.env.VITE_APP_API_BASE}/api/v1/`,
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => `categories`,
    }),
    getCategoryById: builder.query<any, number>({
      query: (id) => `categories/${id}`,
    }),
    getProductsByCatId: builder.query<any, ISearchParams>({
      query: (arg) => ({ url: 'products', params: { ...arg } }),
    }),
    getProductById: builder.query<any, number>({
      query: (id) => `products/${id}`,
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetProductsByCatIdQuery,
  useLazyGetProductByIdQuery,
} = productsApi;
