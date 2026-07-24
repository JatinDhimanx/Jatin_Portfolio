import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <MainLayout>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
