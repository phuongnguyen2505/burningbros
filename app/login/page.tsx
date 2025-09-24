'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '@/libs/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type TLoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<TLoginSchema> = async (data) => {
    setLoginError(null);
    try {
      const { token, ...userData } = await loginUser(data);
      login(userData, token);
      router.push('/');
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof AxiosError) {
        setLoginError(error.response?.data?.message || "Invalid credentials.");
      } else {
        setLoginError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className='text-center text-sm text-gray-600'>Sign in to your account to continue shopping</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm py-8 px-6">
            <div>
              <label htmlFor="username">Username</label>
              <input
                placeholder='Username'
                id="username"
                type="text"
                {...register('username')}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md ring-1 ring-gray-300"
              />
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className="relative mt-1">
                <input
                  placeholder='Password'
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="p-2 block w-full border-gray-300 rounded-md ring-1 ring-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
          </div>
          {loginError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {loginError}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center ring-1 ring-gray-300 bg-blue-950 text-white rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:bg-opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}