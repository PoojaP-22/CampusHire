import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { getInitials, formatDate } from '../../utils/helpers';
import * as api from '../../services/apiService';

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/users', label: 'User Management', icon: '👥' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getStudents();
        setUsers(res.data?.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout navItems={adminNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage all users in the system</p>
      </div>

      <div className="animate-fade-in-up" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', animationDelay: '0.05s', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-premium" style={{ maxWidth: '300px' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'student', 'tpo', 'company', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              background: roleFilter === r ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: `1px solid ${roleFilter === r ? 'var(--accent)' : 'var(--border)'}`,
              color: roleFilter === r ? 'var(--accent-hover)' : 'var(--text-secondary)'
            }}>{r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.1s', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.75rem', fontWeight: '700'
                      }}>{getInitials(u.name)}</div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={u.role || 'student'} /></td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600',
                      background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)'
                    }}>Active</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
