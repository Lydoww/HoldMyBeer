import { BrowserRouter, Route, Routes } from 'react-router';
import Homepage from './pages/Homepage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoutes from './components/routes/PrivateRoutes';
import Layout from './components/ui/Layout';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<PrivateRoutes />}>
              <Route element={<Homepage />} path='/' />
            </Route>
          </Route>
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
