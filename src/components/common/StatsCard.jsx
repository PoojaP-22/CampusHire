const StatsCard = ({ label, value, icon, trend, trendUp, color = 'accent', delay = 0 }) => {
  const colors = {
    accent: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.15)', text: '#818cf8' },
    success: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.15)', text: '#4ade80' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
    danger: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.15)', text: '#f87171' },
    purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.15)', text: '#a78bfa' },
  };
  const c = colors[color] || colors.accent;

  return (
    <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600', marginBottom: '0.5rem' }}>{label}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
          {trend && (
            <p style={{ fontSize: '0.75rem', marginTop: '0.375rem', color: trendUp ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', background: c.bg,
          border: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
