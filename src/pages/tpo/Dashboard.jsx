import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import * as api from '../../services/apiService';

const tpoNav = [
  { path: '/tpo/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/tpo/drives', label: 'Manage Drives', icon: '💼' },
  { path: '/tpo/applications', label: 'Applications', icon: '📄' },
  { path: '/tpo/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/tpo/reports', label: 'Reports', icon: '📈' },
];

const TPODashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState({ students: 0, drives: 0, placed: 0, companies: 0 });
  const [recentDrives, setRecentDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [drivesRes, studentsRes] = await Promise.allSettled([
          api.getDrives(),
          api.getStudents()
        ]);
        const drives = drivesRes.status === 'fulfilled' ? drivesRes.value.data?.data || [] : [];
        const students = studentsRes.status === 'fulfilled' ? studentsRes.value.data?.data || [] : [];
        setRecentDrives(drives.slice(0, 6));
        setStats({
          students: students.length || studentsRes.value?.data?.count || 0,
          drives: drives.length,
          placed: students.filter(s => s.isPlaced).length,
          companies: [...new Set(drives.map(d => d.company?._id).filter(Boolean))].length,
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={tpoNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          TPO Dashboard 🏛️
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage placement drives & monitor student progress</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard label="Total Students" value={stats.students} icon="👨‍🎓" color="accent" delay={0.05} />
        <StatsCard label="Active Drives" value={stats.drives} icon="💼" color="success" delay={0.1} />
        <StatsCard label="Students Placed" value={stats.placed} icon="🏆" color="warning" delay={0.15} />
        <StatsCard label="Companies" value={stats.companies} icon="🏢" color="purple" delay={0.2} />
      </div>

      {/* Recent Drives */}
      <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Drives</h3>
          <Link to="/tpo/drives" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>Manage all →</Link>
        </div>
        {recentDrives.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No drives created yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Drive', 'Company', 'Package', 'Deadline', 'Status', 'Applications'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDrives.map((drive, i) => (
                  <tr key={drive._id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.875rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{drive.title}</td>
                    <td style={{ padding: '0.875rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{drive.company?.name || 'N/A'}</td>
                    <td style={{ padding: '0.875rem', fontSize: '0.8rem', color: 'var(--accent-hover)', fontWeight: '600' }}>{formatCurrency(drive.salary?.ctc)}</td>
                    <td style={{ padding: '0.875rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(drive.deadline)}</td>
                    <td style={{ padding: '0.875rem' }}><StatusBadge status={drive.status || 'Draft'} /></td>
                    <td style={{ padding: '0.875rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>{drive.applicationCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TPODashboard;
