import { useAuth } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router';

const PublicRoutes = () => {
  const token = useAuth((state) => state.token);

  return !token ? <Outlet /> : <Navigate to='/' />;
};

export default PublicRoutes;
