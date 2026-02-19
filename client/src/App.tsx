import { BrowserRouter, Route, Routes } from 'react-router';
import Homepage from '@/pages/Homepage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoutes from '@/components/routes/PrivateRoutes';

import Layout from '@/components/layout/Layout';
import PublicRoutes from '@/components/routes/PublicRoutes';
import Bet from '@/pages/bets/Bet';
import Bets from '@/pages/bets/Bets';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<PrivateRoutes />}>
              <Route element={<Homepage />} path='/' />
              <Route element={<Bets />} path='/bets' />
              <Route element={<Bet />} path='/bets/:id' />
            </Route>
          </Route>
          <Route element={<PublicRoutes />}>
            <Route element={<Login />} path='/login' />
            <Route element={<Register />} path='/register' />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
