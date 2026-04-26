// Reusable Button component — primary, secondary, danger, ghost, success
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
  const variantClass = {
    primary:   'cs-btn-primary',
    secondary: 'cs-btn-secondary',
    danger:    'cs-btn-danger',
    ghost:     'cs-btn-ghost',
    success:   'cs-btn-success',
  }[variant] || 'cs-btn-primary';

  const sizeClass = {
    sm: 'cs-btn-sm',
    md: '',
    lg: 'cs-btn-lg',
  }[size] || '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`cs-btn ${variantClass} ${sizeClass} ${fullWidth ? 'cs-btn-full' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin" width={size === 'sm' ? 13 : 15} height={size === 'sm' ? 13 : 15} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
