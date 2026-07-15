import { forwardRef, useState } from 'react';
import { cn } from '../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ 
  className, 
  type, 
  error, 
  label, 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-textPrimary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
            error && "border-error focus:ring-error",
            isPassword && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export { Input };
