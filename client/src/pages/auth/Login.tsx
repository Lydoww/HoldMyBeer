import { loginUser } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/stores/authStore';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Logo from '@/assets/logofinal.png';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser(user.email, user.password);
      const { token, user: userData } = response;
      setAuth(token, userData);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-2 '>
          <img
            src={Logo}
            alt='HoldMyBeer Logo'
            className='w-32 h-32  '
          />
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className='bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-6 sm:py-10 space-y-5 sm:space-y-6'
        >
          <div className='text-center'>
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white'>
              Sign In
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
              Enter your credentials to continue
            </p>
          </div>

          <div className='space-y-4 sm:space-y-5'>
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Email
              </Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='you@email.com'
                value={user.email}
                onChange={handleChange}
                className='h-10 sm:h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Password
                </Label>
                <Link
                  to='/forgot-password'
                  className='text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id='password'
                type='password'
                name='password'
                placeholder='••••••••'
                value={user.password}
                onChange={handleChange}
                className='h-10 sm:h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20'
              />
            </div>
          </div>

          <Button
            type='submit'
            className='w-full h-10 sm:h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all hover:shadow-md'
          >
            Sign In
          </Button>

          <div className='text-center pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700'>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              No account yet?{' '}
              <Link
                to='/register'
                className='font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline'
              >
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
