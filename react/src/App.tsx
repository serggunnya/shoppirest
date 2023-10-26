import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:id" element={<ProductDetails />} />
      <Route path="*" element={<div>Страница не найдена</div>} />
    </Routes>
  );
};

export default App;
