import { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  disabled, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm",
    secondary: "bg-white text-textPrimary border border-gray-300 hover:bg-gray-50 focus:ring-primary shadow-sm",
    ghost: "bg-transparent text-textSecondary hover:text-textPrimary hover:bg-gray-100 focus:ring-gray-200"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 py-2",
    lg: "h-12 px-8 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";
export { Button };
