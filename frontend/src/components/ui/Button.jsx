// Reusable Button component with primary, secondary, danger, ghost variants
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-transparent focus:ring-blue-500',
    secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-transparent focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-blue-50 text-blue-600 border-transparent focus:ring-blue-400',
    success: 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
