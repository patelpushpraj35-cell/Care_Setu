// Reusable Badge component
const variantMap = {
  blue:    'badge-blue',
  green:   'badge-green',
  red:     'badge-red',
  purple:  'badge-purple',
  orange:  'badge-orange',
  default: 'badge-default',
};

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`cs-badge ${variantMap[variant] || 'badge-default'} ${className}`}>
    {children}
  </span>
);

export default Badge;
