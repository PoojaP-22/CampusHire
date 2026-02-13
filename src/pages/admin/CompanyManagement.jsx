import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { getInitials, formatDate } from '../../utils/helpers';
import * as api from '../../services/apiService';

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/users', label: 'User Management', icon: '👥' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢' },
];

const CompanyManagement = () => {
  const [drives, setDrives] = useState([]);
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

  // Derive unique companies from drives
  const companies = [];
  const seen = new Set();
  drives.forEach(d => {
    const c = d.company;
    if (c && !seen.has(c._id)) {
      seen.add(c._id);
      companies.push({ ...c, driveCount: drives.filter(dr => dr.company?._id === c._id).length });
    }
  });

  return (
    <DashboardLayout navItems={adminNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Company Management</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage registered companies and their drives</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : companies.length === 0 ? (
        <EmptyState icon="🏢" title="No companies" description="No companies have registered yet." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {companies.map((c, i) => (
            <div key={c._id || i} className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: `${0.05 + i * 0.03}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: '700', color: '#fff'
                }}>{getInitials(c.name)}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email || ''}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.25rem 0.625rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                  background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)'
                }}>💼 {c.driveCount} Drives</span>
                <span style={{
                  padding: '0.25rem 0.625rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                  background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)'
                }}>✓ Verified</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined {formatDate(c.createdAt)}</p>
                <StatusBadge status="Active" />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyManagement;
