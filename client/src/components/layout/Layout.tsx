import { Outlet } from 'react-router';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className='bg-[#171817] min-h-screen flex flex-col'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
