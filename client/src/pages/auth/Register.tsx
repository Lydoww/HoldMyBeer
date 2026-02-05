import { registerUser } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/stores/authStore';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Logo from '@/assets/logofinal.png';
import { cn } from '@/lib/utils';
import axios from 'axios';

const Register = () => {
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerUser(
        user.email,
        user.username,
        user.password
      );
      const { token, user: userData } = response;
      setAuth(token, userData);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-4'>
          <img src={Logo} alt='HoldMyBeer Logo' className='w-32 h-32 ' />
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className='bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-6 sm:py-8 space-y-4 sm:space-y-5'
        >
          <div className='text-center'>
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white'>
              Create Account
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
              Join our community of beer lovers
            </p>
          </div>

          <div className='space-y-3 sm:space-y-4'>
            <div className='space-y-1.5'>
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
                className={cn(
                  'h-10 sm:h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20',
                  error && 'border-red-500 border-2'
                )}
              />
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='username'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Username
              </Label>
              <Input
                id='username'
                type='text'
                name='username'
                placeholder='alexis_dev'
                value={user.username}
                onChange={handleChange}
                className={cn(
                  'h-10 sm:h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20',
                  error && 'border-red-500 border-2'
                )}
              />
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                This is how others will see you
              </p>
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Password
              </Label>
              <Input
                id='password'
                type='password'
                name='password'
                placeholder='••••••••'
                value={user.password}
                onChange={handleChange}
                className={cn(
                  'h-10 sm:h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500/20',
                  error && 'border-red-500 border-2'
                )}
              />
            </div>
          </div>

          {error && (
            <p className='text-red-500 font-semibold text-center'>{error}</p>
          )}

          <Button
            disabled={isLoading}
            type='submit'
            className='w-full h-10 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all hover:shadow-md'
          >
            Create Account
          </Button>

          <div className='text-center pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700'>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline'
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
