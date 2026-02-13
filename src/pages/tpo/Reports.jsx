import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import * as api from '../../services/apiService';

const tpoNav = [
  { path: '/tpo/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/tpo/drives', label: 'Manage Drives', icon: '💼' },
  { path: '/tpo/applications', label: 'Applications', icon: '📄' },
  { path: '/tpo/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/tpo/reports', label: 'Reports', icon: '📈' },
];

const PlacementReports = () => {
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, sRes] = await Promise.allSettled([api.getDrives(), api.getStudents()]);
        setDrives(dRes.status === 'fulfilled' ? dRes.value.data?.data || [] : []);
        setStudents(sRes.status === 'fulfilled' ? sRes.value.data?.data || [] : []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  const placed = students.filter(s => s.isPlaced).length;
  const total = students.length;
  const placementRate = total > 0 ? ((placed / total) * 100).toFixed(1) : 0;

  const deptStats = students.reduce((acc, s) => {
    const dept = s.department || 'Other';
    if (!acc[dept]) acc[dept] = { total: 0, placed: 0 };
    acc[dept].total++;
    if (s.isPlaced) acc[dept].placed++;
    return acc;
  }, {});

  return (
    <DashboardLayout navItems={tpoNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Placement Reports</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Analytics and placement statistics</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard label="Total Students" value={total} icon="👨‍🎓" color="accent" delay={0.05} />
        <StatsCard label="Placed" value={placed} icon="✅" color="success" delay={0.1} />
        <StatsCard label="Placement Rate" value={`${placementRate}%`} icon="📈" color="warning" delay={0.15} />
        <StatsCard label="Total Drives" value={drives.length} icon="💼" color="purple" delay={0.2} />
      </div>

      {/* Department Breakdown */}
      <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Department-wise Placement</h3>
        {Object.keys(deptStats).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No data available yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(deptStats).map(([dept, data]) => {
              const pct = data.total > 0 ? ((data.placed / data.total) * 100).toFixed(0) : 0;
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{dept}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{data.placed}/{data.total} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Drives */}
      <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', marginTop: '1.5rem', animationDelay: '0.3s' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Drive Summary</h3>
        {drives.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No drives yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Drive', 'Company', 'Positions', 'Applicants', 'Selected', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drives.map((d, i) => (
                  <tr key={d._id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{d.title}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.company?.name || '—'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.positions || '—'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{d.applicationCount || 0}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--success)' }}>{d.selectedCount || 0}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: '600',
                        background: d.status === 'Published' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                        color: d.status === 'Published' ? '#86efac' : '#fcd34d',
                      }}>{d.status}</span>
                    </td>
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

export default PlacementReports;
