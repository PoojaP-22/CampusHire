import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatCurrency, truncate } from '../../utils/helpers';
import * as api from '../../services/apiService';

const studentNav = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/student/drives', label: 'Browse Drives', icon: '💼' },
  { path: '/student/applications', label: 'My Applications', icon: '📄' },
  { path: '/student/profile', label: 'My Profile', icon: '👤' },
];

const BrowseDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getDrives({ status: 'Active' });
        setDrives(res.data?.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  const handleApply = async (driveId) => {
    setApplying(true);
    try {
      await api.applyToDrive({ drive: driveId });
      alert('Applied successfully!');
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply');
    }
    setApplying(false);
  };

  const filtered = drives.filter(d =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={studentNav}>
      <div className="animate-fade-in-up">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Browse Drives</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Find and apply to placement drives</p>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem', animationDelay: '0.05s' }}>
        <input
          type="text" placeholder="Search drives by title or company..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input-premium" style={{ maxWidth: '400px' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading drives...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📭" title="No drives found" description="No placement drives available at the moment. Check back later!" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filtered.map((drive, i) => (
            <div key={drive._id || i} className="card-premium animate-fade-in-up" style={{
              padding: '1.5rem', cursor: 'pointer', animationDelay: `${0.1 + i * 0.03}s`
            }} onClick={() => setSelected(drive)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{drive.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{drive.company?.name || 'Company'}</p>
                </div>
                <StatusBadge status={drive.status || 'Published'} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
                {truncate(drive.description, 100)}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>💰 {formatCurrency(drive.salary?.ctc)}</span>
                <span>📅 {formatDate(drive.deadline)}</span>
                <span>📍 {drive.location || 'Remote'}</span>
              </div>
              {drive.eligibilityCriteria?.minCGPA && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Min CGPA: {drive.eligibilityCriteria.minCGPA} • {drive.eligibilityCriteria.allowedDepartments?.join(', ') || 'All Depts'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drive Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title || 'Drive Details'} width="600px">
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <StatusBadge status={selected.status || 'Published'} />
              {selected.type && <span className="badge badge-accent">{selected.type}</span>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</h4>
              <p style={{ color: 'var(--text-primary)' }}>{selected.company?.name || 'N/A'}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{selected.description || 'No description'}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Package</p><p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formatCurrency(selected.salary?.ctc)}</p></div>
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</p><p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selected.location || 'TBD'}</p></div>
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deadline</p><p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{formatDate(selected.deadline)}</p></div>
              <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min CGPA</p><p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selected.eligibilityCriteria?.minCGPA || 'N/A'}</p></div>
            </div>
            <button onClick={() => handleApply(selected._id)} disabled={applying} className="btn-primary">
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default BrowseDrives;
