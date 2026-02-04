import { useAuth } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router';

const PrivateRoutes = () => {
  const token = useAuth((state) => state.token);

  return token ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoutes;
