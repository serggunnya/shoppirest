import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/appLayout/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </AppLayout>
  );
};

export default App;
