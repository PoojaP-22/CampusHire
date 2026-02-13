import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';
import * as api from '../../services/apiService';

const studentNav = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/student/drives', label: 'Browse Drives', icon: '💼' },
  { path: '/student/applications', label: 'My Applications', icon: '📄' },
  { path: '/student/profile', label: 'My Profile', icon: '👤' },
];

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getMyApplications();
        setApps(res.data?.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await api.withdrawApplication(id);
      setApps(prev => prev.filter(a => a._id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
  const filtered = filter === 'All' ? apps : apps.filter(a => a.status === filter);

  return (
    <DashboardLayout navItems={studentNav}>
      <div className="animate-fade-in-up">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>My Applications</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Track all your placement applications</p>
      </div>

      {/* Status Filter */}
      <div className="animate-fade-in-up" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', animationDelay: '0.05s' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '500',
            border: '1px solid', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            background: filter === s ? 'rgba(99,102,241,0.12)' : 'transparent',
            borderColor: filter === s ? 'var(--accent)' : 'var(--border)',
            color: filter === s ? 'var(--accent-hover)' : 'var(--text-secondary)',
          }}>{s} {filter !== 'All' || s === 'All' ? '' : `(${apps.filter(a => a.status === s).length})`}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading applications...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📄" title="No applications" description="You haven't applied to any drives yet." action="Browse Drives" onAction={() => window.location.href = '/student/drives'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((app, i) => (
            <div key={app._id || i} className="card-premium animate-fade-in-up" style={{ padding: '1.25rem', animationDelay: `${0.1 + i * 0.03}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{app.drive?.title || 'Drive'}</h3>
                    <StatusBadge status={app.status || 'Applied'} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {app.drive?.company?.name || 'Company'} • Applied on {formatDate(app.createdAt)}
                  </p>
                  {app.interviewDetails?.date && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.375rem' }}>
                      🗓 Interview: {formatDate(app.interviewDetails.date)} • {app.interviewDetails.type || 'Online'}
                    </p>
                  )}
                  {app.feedback && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.375rem', fontStyle: 'italic' }}>
                      💬 "{app.feedback}"
                    </p>
                  )}
                </div>
                {app.status === 'Applied' && (
                  <button onClick={() => handleWithdraw(app._id)} className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyApplications;
