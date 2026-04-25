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
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={16} />
        </span>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-slate-50 disabled:cursor-not-allowed
          ${Icon ? 'pl-9' : ''}
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'}
        `}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-600">{error}</p>}
    {helper && !error && <p className="text-xs text-slate-500">{helper}</p>}
  </div>
);

export default Input;
