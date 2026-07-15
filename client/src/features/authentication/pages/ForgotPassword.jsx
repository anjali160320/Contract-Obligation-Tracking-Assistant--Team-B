import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileSignature, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { forgotPasswordSchema } from '../validation/authSchemas';
import { forgotPassword } from '../services/authService';

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
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
        <div className="flex flex-col items-center text-center">
          
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
              <div className="h-14 w-14 text-success mb-4">
                <CheckCircle2 className="h-full w-full" />
              </div>
              <h2 className="text-2xl font-semibold text-textPrimary tracking-tight">Check your email</h2>
              <p className="mt-2 text-sm text-textSecondary">
                We've sent a password reset link to your email address.
              </p>
              <Link to="/login" className="w-full mt-8 block">
                <Button className="w-full" variant="secondary">
                  Back to login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <FileSignature className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-textPrimary tracking-tight">
                Reset your password
              </h2>
              <p className="mt-2 text-sm text-textSecondary">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form className="mt-8 space-y-5 w-full text-left" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                
                <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
                  Send Reset Link
                </Button>
                
                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
