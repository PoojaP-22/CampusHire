import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import { formatCurrency } from '../../utils/helpers';
import * as api from '../../services/apiService';

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/users', label: 'User Management', icon: '👥' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢' },
];

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, dRes] = await Promise.all([
          api.getStudents().catch(() => ({ data: { data: [] } })),
          api.getDrives().catch(() => ({ data: { data: [] } })),
        ]);
        setStudents(sRes.data?.data || []);
        setDrives(dRes.data?.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  const placed = students.filter(s => s.placementStatus === 'Placed').length;
  const deptData = {};
  students.forEach(s => {
    const dept = s.department || 'Other';
    if (!deptData[dept]) deptData[dept] = { total: 0, placed: 0 };
    deptData[dept].total++;
    if (s.placementStatus === 'Placed') deptData[dept].placed++;
  });

  const ctcValues = drives.map(d => d.salary?.ctc).filter(Boolean);
  const avgPkg = ctcValues.length ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length) : 0;
  const maxPkg = ctcValues.length ? Math.max(...ctcValues) : 0;
  const driveTypes = {};
  drives.forEach(d => { driveTypes[d.type || 'Other'] = (driveTypes[d.type || 'Other'] || 0) + 1; });

  return (
    <DashboardLayout navItems={adminNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>System-wide placement analytics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard label="Placement Rate" value={`${students.length ? Math.round(placed / students.length * 100) : 0}%`} icon="📊" color="accent" delay={0.05} />
        <StatsCard label="Average Package" value={formatCurrency(avgPkg)} icon="💰" color="success" delay={0.1} />
        <StatsCard label="Highest Package" value={formatCurrency(maxPkg)} icon="🏆" color="warning" delay={0.15} />
        <StatsCard label="Active Drives" value={drives.filter(d => d.status === 'Published').length} icon="🔥" color="purple" delay={0.2} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Department Breakdown */}
        <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.25s' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Department-wise Placement</h3>
          {Object.entries(deptData).map(([dept, data]) => {
            const pct = data.total ? Math.round(data.placed / data.total * 100) : 0;
            return (
              <div key={dept} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{dept}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{data.placed}/{data.total} ({pct}%)</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', background: 'linear-gradient(90deg, var(--accent), #8b5cf6)', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
          {Object.keys(deptData).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No data yet.</p>}
        </div>

        {/* Drive Types */}
        <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Drive Type Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(driveTypes).map(([type, count]) => (
              <div key={type} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)'
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {type === 'Full-Time' ? '💼' : type === 'Internship' ? '📝' : '🔗'} {type}
                </span>
                <span style={{
                  padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                  background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)'
                }}>{count}</span>
              </div>
            ))}
            {Object.keys(driveTypes).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No data yet.</p>}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Package Ranges</h4>
            {[
              { label: '< 5 LPA', range: [0, 500000] },
              { label: '5 - 10 LPA', range: [500000, 1000000] },
              { label: '10 - 20 LPA', range: [1000000, 2000000] },
              { label: '20+ LPA', range: [2000000, Infinity] },
            ].map(({ label, range }) => {
              const count = drives.filter(d => d.salary?.ctc >= range[0] && d.salary?.ctc < range[1]).length;
              return (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)' }}>{count} drives</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drives Table */}
      <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', overflow: 'hidden', animationDelay: '0.35s' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>All Drives Summary</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Drive', 'Company', 'Package', 'Type', 'Applicants', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drives.slice(0, 10).map((d, i) => (
                <tr key={d._id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{d.title}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.company?.name || '—'}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatCurrency(d.salary?.ctc)}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.type}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)' }}>{d.applicationCount || 0}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: d.status === 'Published' ? '#4ade80' : 'var(--text-muted)' }}>{d.status}</td>
                </tr>
              ))}
              {drives.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No drives data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
