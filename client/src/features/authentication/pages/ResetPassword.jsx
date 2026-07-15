import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileSignature } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { resetPasswordSchema } from '../validation/authSchemas';
import { resetPassword } from '../services/authService';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

export default function ResetPassword() {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'mock-token';
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  const currentPassword = useWatch({ control, name: 'password' });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await resetPassword(token, data.password);
      navigate('/reset-success');
    } catch (error) {
      setServerError(error.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full space-y-8 bg-surface p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
            <FileSignature className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-textPrimary tracking-tight">
            Set new password
          </h2>
          <p className="mt-2 text-sm text-textSecondary text-center">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        {serverError && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error font-medium text-center">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <PasswordStrengthMeter password={currentPassword} />
          </div>
          
          <div className="pt-2">
            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button type="submit" className="w-full mt-8" isLoading={isSubmitting}>
            Reset password
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
