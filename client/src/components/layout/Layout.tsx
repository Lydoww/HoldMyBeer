import { Outlet } from 'react-router';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className='bg-[#191919] text-gray-100 min-h-screen flex flex-col'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
