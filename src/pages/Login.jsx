import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserRound, LockKeyhole, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //   const response = await axios.post(
      //     "http://localhost:3000/api/login",
      //     {
      //       code,
      //       password,
      //     }
      //   );

      //   console.log(response.data);

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Code atau password salah');
    }
  };

  return (
    <div className='min-h-screen bg-orange-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        {/* Card Login */}
        <div className='bg-white rounded-2xl shadow-lg p-8'>
          <h1 className='text-2xl font-bold text-center text-primary'>Nifa Cake</h1>

          <h2 className='text-xl font-semibold text-center text-gray-800 mb-6'>Login</h2>

          {/* Error */}
          {error && <div className='bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm'>{error}</div>}

          <form onSubmit={handleLogin}>
            {/* Code */}
            <div className='mb-5'>
              <label className='block text-gray-700 mb-2'>Code</label>

              <div className='relative'>
                <UserRound size={20} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

                <input
                  type='text'
                  placeholder='Masukkan code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary'
                />
              </div>
            </div>

            {/* Password */}
            <div className='mb-3'>
              <label className='block text-gray-700 mb-2'>Password</label>

              <div className='relative'>
                <LockKeyhole size={20} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Masukkan password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg py-3 pl-11 pr-11 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary'
                />

                {/* Tombol lihat password */}
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Lupa Password */}
            <div className='text-right mb-6'>
              <button type='button' className='text-sm text-#2B1B17 hover:underline'>
                Lupa Password?
              </button>
            </div>

            {/* Tombol Login */}
            <button type='submit' className='w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition'>
              Login
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className='text-center text-sm text-gray-400 mt-6'>© 2026 Nifa Cake</p>
      </div>
    </div>
  );
}
