import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';
import * as api from '../../services/apiService';

const tpoNav = [
  { path: '/tpo/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/tpo/drives', label: 'Manage Drives', icon: '💼' },
  { path: '/tpo/applications', label: 'Applications', icon: '📄' },
  { path: '/tpo/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/tpo/reports', label: 'Reports', icon: '📈' },
];

const ReviewApplications = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getDrives();
        setDrives(res.data?.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedDrive) { setApps([]); return; }
    const load = async () => {
      try {
        const res = await api.getApplicationsForDrive(selectedDrive);
        setApps(res.data?.data || []);
      } catch (err) { console.error(err); }
    };
    load();
  }, [selectedDrive]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await api.updateApplicationStatus(appId, { status });
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const statusActions = ['Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

  return (
    <DashboardLayout navItems={tpoNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Review Applications</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage student applications for drives</p>
      </div>

      {/* Drive Selector */}
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem', animationDelay: '0.05s' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Select a drive to review applications:</label>
        <select value={selectedDrive} onChange={e => setSelectedDrive(e.target.value)} className="select-premium" style={{ maxWidth: '400px' }}>
          <option value="">— Select Drive —</option>
          {drives.map(d => <option key={d._id} value={d._id}>{d.title} ({d.applicationCount || 0} apps)</option>)}
        </select>
      </div>

      {!selectedDrive ? (
        <EmptyState icon="📋" title="Select a drive" description="Choose a drive above to view and manage its applications." />
      ) : apps.length === 0 ? (
        <EmptyState icon="📄" title="No applications" description="No students have applied to this drive yet." />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <thead>
              <tr>
                {['Student', 'Email', 'Applied', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <tr key={app._id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{app.student?.name || 'Student'}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.student?.email || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(app.createdAt)}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={app.status} /></td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <select value="" onChange={e => handleStatusUpdate(app._id, e.target.value)} className="select-premium" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', minWidth: '140px' }}>
                      <option value="">Change status</option>
                      {statusActions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReviewApplications;
