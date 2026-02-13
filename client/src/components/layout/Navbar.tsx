import Logo from '@/assets/logofinal.png';
import { useAuth } from '@/stores/authStore';
import { NavLink, useNavigate } from 'react-router';
import { LogOut, Trophy } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
        {/* Left - Navigation */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/bets"
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isActive
                  ? 'text-[#fde639] bg-[#fde639]/10'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Community
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-[#fde639]" />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isActive
                  ? 'text-[#fde639] bg-[#fde639]/10'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Profile
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-[#fde639]" />
                )}
              </>
            )}
          </NavLink>
        </div>

        {/* Center - Logo */}
        <NavLink to="/" className="absolute left-1/2 -translate-x-1/2">
          <img
            src={Logo}
            alt="Hold My Beer"
            className="h-12 w-auto hover:scale-105 transition-transform"
          />
        </NavLink>

        {/* Right - Points & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-[#fde639]/10 px-3.5 py-1.5 border border-[#fde639]/20">
            <Trophy size={14} className="text-[#fde639]" />
            <span className="text-sm font-bold text-[#fde639]">
              {user?.points}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;