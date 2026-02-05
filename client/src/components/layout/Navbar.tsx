import Logo from '@/assets/logofinal.png';
import { useAuth } from '@/stores/authStore';
import { NavLink, useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-[#2e312e] shadow-lg border-b border-[#696c69] h-18 text-white'>
      <div className='flex items-center px-4 h-full'>
        <div className='flex items-center gap-12 flex-1'>
          <ul className='flex gap-12'>
            <li className='cursor-pointer hover:scale-105 transition-transform'>
              <NavLink to={'/bets'}>Bets</NavLink>
            </li>
            <li className='cursor-pointer hover:scale-105 transition-transform'>
              <NavLink to={'/profile'}>Profile</NavLink>
            </li>
          </ul>
        </div>
        <div className='flex-1 flex justify-center'>
          <NavLink to={'/'}>
            <img
              src={Logo}
              alt='logo of Hold My Beer website'
              className='size-20 hover:scale-105 cursor-pointer transition-transform'
            />
          </NavLink>
        </div>
        <div className='flex flex-1 justify-end items-center gap-12'>
          <p>🏆 {user?.points}</p>
          <button
            className='text-red-500 hover:scale-105 cursor-pointer transition-transform'
            onClick={handleLogout}
          >
            <LogOut />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
