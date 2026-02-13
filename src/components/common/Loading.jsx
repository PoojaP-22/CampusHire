const Loading = () => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)', gap: '1.5rem'
    }}>
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid var(--border)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid transparent',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin-slow 0.8s linear infinite'
        }} />
        <div style={{
          position: 'absolute', inset: '8px',
          border: '3px solid transparent',
          borderTopColor: '#8b5cf6',
          borderRadius: '50%',
          animation: 'spin-slow 1.2s linear infinite reverse'
        }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: '500' }}>
          Loading...
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
          Please wait a moment
        </p>
      </div>
    </div>
  );
};

export default Loading;
