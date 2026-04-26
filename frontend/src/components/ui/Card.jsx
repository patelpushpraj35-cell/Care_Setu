// Reusable Card component
export const Card = ({ children, className = '', padding = true }) => (
  <div className={`cs-card ${padding ? 'cs-card-body' : ''} ${className}`}>
    {children}
  </div>
);

// Stat card for dashboard metrics
export const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => (
  <div className="cs-stat-card">
    <div className={`cs-stat-icon stat-${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="cs-stat-label">{title}</p>
      <p className="cs-stat-value">{value}</p>
      {trend && <p className="cs-stat-trend">{trend}</p>}
    </div>
  </div>
);

export default Card;
