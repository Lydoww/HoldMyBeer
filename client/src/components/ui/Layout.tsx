import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className='bg-[#171817] min-h-screen flex flex-col'>
      <Outlet />
    </div>
  );
};

export default Layout;
