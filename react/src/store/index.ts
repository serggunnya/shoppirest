import { configureStore } from '@reduxjs/toolkit';

import { productsApi } from './slices/productSlice';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
  devTools: true,
});
