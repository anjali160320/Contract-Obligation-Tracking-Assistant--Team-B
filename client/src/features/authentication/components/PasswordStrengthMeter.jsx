import { Check, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

export function PasswordStrengthMeter({ password }) {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[0-9]/, text: "At least 1 number" },
  ];

  const calculateStrength = () => {
    if (!password) return 0;
    let strength = 0;
    requirements.forEach((req) => {
      if (req.regex.test(password)) strength += 1;
    });
    return strength;
  };

  const strength = calculateStrength();
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength <= 1) return 'bg-error';
    if (strength <= 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-400';
    return 'bg-success';
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-1.5 h-1">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              "h-full w-full rounded-full transition-colors duration-300",
              index <= strength ? getStrengthColor() : "bg-gray-200"
            )}
          />
        ))}
      </div>
      
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
          const isMet = req.regex.test(password);
          return (
            <div key={index} className="flex items-center text-xs font-medium">
              {isMet ? (
                <Check className="h-3.5 w-3.5 text-success mr-2" />
              ) : (
                <X className="h-3.5 w-3.5 text-gray-400 mr-2" />
              )}
              <span className={isMet ? "text-textSecondary" : "text-gray-400"}>
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
