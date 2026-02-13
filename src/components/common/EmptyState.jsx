const EmptyState = ({ icon = '📭', title, description, action, onAction }) => (
  <div className="animate-fade-in" style={{
    textAlign: 'center', padding: '4rem 2rem',
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px'
  }}>
    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>{description}</p>
    {action && (
      <button onClick={onAction} className="btn-primary" style={{ width: 'auto', padding: '0.7rem 1.5rem' }}>
        {action}
      </button>
    )}
  </div>
);

export default EmptyState;
