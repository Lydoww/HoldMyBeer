import { BrowserRouter, Route, Routes } from 'react-router';
import Homepage from './pages/Homepage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoutes from './components/routes/PrivateRoutes';
import React, { Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import PublicRoutes from './components/routes/PublicRoutes';

const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));
const Bets = React.lazy(() => import('@/pages/bets/Bets'));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route element={<PrivateRoutes />}>
                <Route element={<Homepage />} path='/' />
                <Route element={<Bets />} path='/bets' />
              </Route>
            </Route>
            <Route element={<PublicRoutes />}>
              <Route element={<Login />} path='/login' />
              <Route element={<Register />} path='/register' />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
