import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';

export default function PasswordResetSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full space-y-8 bg-surface p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200 text-center"
      >
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 text-success mb-6">
            <CheckCircle2 className="h-full w-full" />
          </div>
          <h2 className="text-2xl font-semibold text-textPrimary tracking-tight">
            Password reset complete
          </h2>
          <p className="mt-3 text-sm text-textSecondary">
            Your password has been successfully reset. You can now use your new password to log in to your account.
          </p>
          
          <Link to="/login" className="w-full mt-8 block">
            <Button className="w-full">
              Go to login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
