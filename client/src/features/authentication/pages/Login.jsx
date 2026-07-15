import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FileSignature } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { loginSchema } from '../validation/authSchemas';
import { login } from '../services/authService';

export default function Login() {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-surface p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
            <FileSignature className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-textPrimary tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-textSecondary">
            Sign in to your ContractIQ account
          </p>
        </div>

        {serverError && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error font-medium text-center">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-colors cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-textSecondary cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
