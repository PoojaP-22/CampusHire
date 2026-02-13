import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import * as api from '../../services/apiService';

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/users', label: 'User Management', icon: '👥' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢' },
];

const AdminDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState({ students: 0, companies: 0, drives: 0, placed: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [studRes, driveRes] = await Promise.all([
          api.getStudents().catch(() => ({ data: { data: [] } })),
          api.getDrives().catch(() => ({ data: { data: [] } })),
        ]);
        const students = studRes.data?.data || [];
        const drives = driveRes.data?.data || [];
        const placed = students.filter(s => s.placementStatus === 'Placed').length;
        setStats({ students: students.length, companies: [...new Set(drives.map(d => d.company?._id).filter(Boolean))].length, drives: drives.length, placed });
        setRecentUsers(students.slice(0, 6));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={adminNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Admin Console 🛡️
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>System-wide overview &amp; management</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard label="Total Students" value={stats.students} icon="🎓" color="accent" delay={0.05} />
        <StatsCard label="Companies" value={stats.companies} icon="🏢" color="success" delay={0.1} />
        <StatsCard label="Total Drives" value={stats.drives} icon="💼" color="warning" delay={0.15} />
        <StatsCard label="Students Placed" value={stats.placed} icon="🏆" color="purple" delay={0.2} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { to: '/admin/users', icon: '👥', label: 'Manage Users' },
              { to: '/admin/analytics', icon: '📈', label: 'View Analytics' },
              { to: '/admin/companies', icon: '🏢', label: 'Manage Companies' },
            ].map(action => (
              <Link key={action.to} to={action.to} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                borderRadius: '10px', textDecoration: 'none', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Placement Rate</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: `conic-gradient(var(--accent) ${stats.students ? (stats.placed / stats.students * 360) : 0}deg, rgba(255,255,255,0.05) 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent)'
              }}>
                {stats.students ? Math.round(stats.placed / stats.students * 100) : 0}%
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stats.placed} out of {stats.students} students placed</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
