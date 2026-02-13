import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import * as api from '../../services/apiService';

const studentNav = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/student/drives', label: 'Browse Drives', icon: '💼' },
  { path: '/student/applications', label: 'My Applications', icon: '📄' },
  { path: '/student/profile', label: 'My Profile', icon: '👤' },
];

const StudentDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState({ drives: 0, applications: 0, interviews: 0, offers: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.allSettled([
          api.getEligibleDrives(),
          api.getMyApplications()
        ]);
        const drives = drivesRes.status === 'fulfilled' ? drivesRes.value.data?.data || [] : [];
        const apps = appsRes.status === 'fulfilled' ? appsRes.value.data?.data || [] : [];
        setUpcomingDrives(drives.slice(0, 5));
        setRecentApps(apps.slice(0, 5));
        setStats({
          drives: drives.length,
          applications: apps.length,
          interviews: apps.filter(a => a.status === 'Interview Scheduled').length,
          offers: apps.filter(a => a.status === 'Selected').length,
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout navItems={studentNav}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Here's your placement overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard label="Eligible Drives" value={stats.drives} icon="💼" color="accent" delay={0.05} />
        <StatsCard label="Applications" value={stats.applications} icon="📄" color="success" delay={0.1} />
        <StatsCard label="Interviews" value={stats.interviews} icon="🎯" color="warning" delay={0.15} />
        <StatsCard label="Offers" value={stats.offers} icon="🏆" color="purple" delay={0.2} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Applications</h3>
            <Link to="/student/applications" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentApps.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No applications yet. <Link to="/student/drives" style={{ color: 'var(--accent)' }}>Browse drives</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentApps.map((app, i) => (
                <div key={app._id || i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)', transition: 'all 0.2s'
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{app.drive?.title || 'Drive'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{app.drive?.company?.name || 'Company'} • {formatDate(app.createdAt)}</p>
                  </div>
                  <StatusBadge status={app.status || 'Applied'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Drives */}
        <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Eligible Drives</h3>
            <Link to="/student/drives" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {upcomingDrives.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No drives available right now.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingDrives.map((drive, i) => (
                <div key={drive._id || i} style={{
                  padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)', transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{drive.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{drive.company?.name || 'Company'}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>
                      {formatCurrency(drive.salary?.ctc)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up" style={{ marginTop: '1.5rem', animationDelay: '0.35s' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Browse Drives', icon: '🔍', path: '/student/drives' },
            { label: 'My Applications', icon: '📋', path: '/student/applications' },
            { label: 'Update Profile', icon: '✏️', path: '/student/profile' },
          ].map(action => (
            <Link key={action.path} to={action.path} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px',
              textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500',
              transition: 'all 0.2s'
            }}>
              <span>{action.icon}</span> {action.label}
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
