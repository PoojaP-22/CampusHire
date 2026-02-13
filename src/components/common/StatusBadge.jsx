const StatusBadge = ({ status }) => {
  const map = {
    'Applied': { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
    'Under Review': { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
    'Shortlisted': { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
    'Interview Scheduled': { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
    'Interview Completed': { bg: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: 'rgba(139,92,246,0.2)' },
    'Selected': { bg: 'rgba(34,197,94,0.12)', color: '#86efac', border: 'rgba(34,197,94,0.2)' },
    'Rejected': { bg: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: 'rgba(239,68,68,0.2)' },
    'Withdrawn': { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.2)' },
    'Published': { bg: 'rgba(34,197,94,0.12)', color: '#86efac', border: 'rgba(34,197,94,0.2)' },
    'Draft': { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
    'Closed': { bg: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: 'rgba(239,68,68,0.2)' },
    'Active': { bg: 'rgba(34,197,94,0.12)', color: '#86efac', border: 'rgba(34,197,94,0.2)' },
    'Pending': { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
  };
  const s = map[status] || map['Applied'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem',
      borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.04em',
      textTransform: 'uppercase', background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
      {status}
    </span>
  );
};

export default StatusBadge;
