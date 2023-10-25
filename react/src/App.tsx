import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/ui/layout/AppLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';

// const App: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<AppLayout />}>
//         <Route index element={<Home />} />
//         <Route path="products" element={<Products />} />
//         <Route path="*" element={<div>Страница не найдена</div>} />
//       </Route>
//     </Routes>
//   );
// };

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="products" element={<Products />} />
      <Route path="*" element={<div>Страница не найдена</div>} />
    </Routes>
  );
};

export default App;
