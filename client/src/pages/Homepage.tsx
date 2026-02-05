import { useAuth } from '@/stores/authStore';

const Homepage = () => {
  const setAuth = useAuth((state) => state.user);
  return <div>Welcome {setAuth?.username}</div>;
};

export default Homepage;
