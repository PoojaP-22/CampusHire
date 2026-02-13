const Modal = ({ isOpen, onClose, title, children, width = '500px' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease'
    }}
      onClick={onClose}
    >
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px',
        width: '90%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)', animation: 'fadeInUp 0.3s ease'
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
          }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
