import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import * as api from '../../services/apiService';

const companyNav = [
  { path: '/company/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/company/drives', label: 'My Drives', icon: '💼' },
  { path: '/company/applicants', label: 'Applicants', icon: '👥' },
  { path: '/company/profile', label: 'Company Profile', icon: '🏢' },
];

const CompanyDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState({ drives: 0, applicants: 0, shortlisted: 0, selected: 0 });
  const [recentDrives, setRecentDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getMyDrives();
        const drives = res.data?.data || [];
        setRecentDrives(drives.slice(0, 5));
        const totalApps = drives.reduce((sum, d) => sum + (d.applicationCount || 0), 0);
        setStats({
          drives: drives.length,
          applicants: totalApps,
          shortlisted: drives.reduce((sum, d) => sum + (d.shortlistedCount || 0), 0),
          selected: drives.reduce((sum, d) => sum + (d.selectedCount || 0), 0),
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={companyNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Welcome, {user?.name?.split(' ')[0]} 🏢
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your recruitment drives</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard label="My Drives" value={stats.drives} icon="💼" color="accent" delay={0.05} />
        <StatsCard label="Total Applicants" value={stats.applicants} icon="👥" color="success" delay={0.1} />
        <StatsCard label="Shortlisted" value={stats.shortlisted} icon="⭐" color="warning" delay={0.15} />
        <StatsCard label="Selected" value={stats.selected} icon="🎯" color="purple" delay={0.2} />
      </div>

      <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Your Recent Drives</h3>
          <Link to="/company/drives" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
        </div>
        {recentDrives.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No drives posted yet. <Link to="/company/drives" style={{ color: 'var(--accent)' }}>Post your first drive</Link></p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentDrives.map((drive, i) => (
              <div key={drive._id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.875rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)', transition: 'all 0.2s'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{drive.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                    {formatCurrency(drive.salary?.ctc)} • {drive.applicationCount || 0} applicants • {formatDate(drive.deadline)}
                  </p>
                </div>
                <StatusBadge status={drive.status || 'Draft'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
