// Reusable Input component with label, error, and icon support
const Input = ({
  label,
  id,
  error,
  helper,
  icon: Icon,
  type = 'text',
  required = false,
  className = '',
  ...props
}) => (
  <div className={`flex flex-col ${className}`}>
    {label && (
      <label htmlFor={id} className="cs-label">
        {label}
        {required && <span className="cs-label-required">*</span>}
      </label>
    )}
    <div className="cs-input-wrap">
      {Icon && (
        <span className="cs-input-icon">
          <Icon size={15} />
        </span>
      )}
      <input
        id={id}
        type={type}
        className={`cs-input ${Icon ? 'has-icon' : ''} ${error ? 'error' : ''}`}
        {...props}
      />
    </div>
    {error   && <p className="cs-field-error">{error}</p>}
    {helper && !error && <p className="cs-field-helper">{helper}</p>}
  </div>
);

export default Input;
