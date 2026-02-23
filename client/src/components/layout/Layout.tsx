import { Outlet } from 'react-router';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div
      style={{ fontFamily: 'Oswald, sans-serif' }}
      className='bg-[#191919] text-gray-100 min-h-screen flex flex-col flex-1'
    >
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
