import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getInitials } from '../../utils/helpers';
import * as api from '../../services/apiService';

const companyNav = [
  { path: '/company/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/company/drives', label: 'My Drives', icon: '💼' },
  { path: '/company/applicants', label: 'Applicants', icon: '👥' },
  { path: '/company/profile', label: 'Company Profile', icon: '🏢' },
];

const Applicants = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInterview, setShowInterview] = useState(null);
  const [interviewData, setInterviewData] = useState({ date: '', type: 'Online', location: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getMyDrives();
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

  const handleSchedule = async () => {
    if (!showInterview) return;
    try {
      await api.scheduleInterview(showInterview, interviewData);
      setApps(prev => prev.map(a => a._id === showInterview ? { ...a, status: 'Interview Scheduled', interviewDetails: interviewData } : a));
      setShowInterview(null);
      setInterviewData({ date: '', type: 'Online', location: '' });
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <DashboardLayout navItems={companyNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Applicants</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Review and manage applicants for your drives</p>
      </div>

      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem', animationDelay: '0.05s' }}>
        <select value={selectedDrive} onChange={e => setSelectedDrive(e.target.value)} className="select-premium" style={{ maxWidth: '400px' }}>
          <option value="">— Select a Drive —</option>
          {drives.map(d => <option key={d._id} value={d._id}>{d.title} ({d.applicationCount || 0})</option>)}
        </select>
      </div>

      {!selectedDrive ? (
        <EmptyState icon="👥" title="Select a drive" description="Choose one of your drives to view its applicants." />
      ) : apps.length === 0 ? (
        <EmptyState icon="📭" title="No applicants yet" description="No students have applied to this drive yet." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {apps.map((app, i) => (
            <div key={app._id || i} className="card-premium animate-fade-in-up" style={{ padding: '1.25rem', animationDelay: `${0.1 + i * 0.02}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.8rem', fontWeight: '700'
                  }}>{getInitials(app.student?.name)}</div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{app.student?.name || 'Student'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.student?.email || '—'} • Applied {formatDate(app.createdAt)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={app.status || 'Applied'} />
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => handleStatusUpdate(app._id, 'Shortlisted')} title="Shortlist" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '0.375rem 0.625rem', cursor: 'pointer', fontSize: '0.75rem', color: '#4ade80', fontFamily: 'Inter' }}>✓ Shortlist</button>
                    <button onClick={() => setShowInterview(app._id)} title="Schedule Interview" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '0.375rem 0.625rem', cursor: 'pointer', fontSize: '0.75rem', color: '#fbbf24', fontFamily: 'Inter' }}>📅 Interview</button>
                    <button onClick={() => handleStatusUpdate(app._id, 'Selected')} title="Select" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '0.375rem 0.625rem', cursor: 'pointer', fontSize: '0.75rem', color: '#a5b4fc', fontFamily: 'Inter' }}>🏆 Select</button>
                    <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} title="Reject" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.375rem 0.625rem', cursor: 'pointer', fontSize: '0.75rem', color: '#f87171', fontFamily: 'Inter' }}>✕ Reject</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interview Modal */}
      <Modal isOpen={!!showInterview} onClose={() => setShowInterview(null)} title="Schedule Interview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Date & Time</label>
            <input type="datetime-local" value={interviewData.date} onChange={e => setInterviewData(p => ({ ...p, date: e.target.value }))} className="input-premium" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Type</label>
            <select value={interviewData.type} onChange={e => setInterviewData(p => ({ ...p, type: e.target.value }))} className="select-premium">
              <option value="Online">Online</option><option value="Offline">Offline</option><option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Location / Link</label>
            <input value={interviewData.location} onChange={e => setInterviewData(p => ({ ...p, location: e.target.value }))} className="input-premium" placeholder="Zoom link or venue" />
          </div>
          <button onClick={handleSchedule} className="btn-primary">Schedule Interview</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Applicants;
