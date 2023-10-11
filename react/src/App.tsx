import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './components/appLayout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </AppLayout>
  );
};

export default App;
