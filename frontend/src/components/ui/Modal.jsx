// Reusable Modal component
import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = { sm: 'cs-modal-sm', md: 'cs-modal-md', lg: 'cs-modal-lg', xl: 'cs-modal-xl' }[size] || 'cs-modal-md';

  return (
    <div className="cs-modal-backdrop" onClick={onClose}>
      <div
        className={`cs-modal ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cs-modal-header">
          <h2 className="cs-modal-title">{title}</h2>
          <button onClick={onClose} className="cs-icon-btn" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="cs-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
