import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import EmptyState from '../../components/common/EmptyState';
import { getInitials } from '../../utils/helpers';
import * as api from '../../services/apiService';

const tpoNav = [
  { path: '/tpo/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/tpo/drives', label: 'Manage Drives', icon: '💼' },
  { path: '/tpo/applications', label: 'Applications', icon: '📄' },
  { path: '/tpo/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/tpo/reports', label: 'Reports', icon: '📈' },
];

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (deptFilter) params.department = deptFilter;
        const res = await api.getStudents(params);
        setStudents(res.data?.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, [deptFilter]);

  const departments = ['', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

  const filtered = students.filter(s =>
    (s.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={tpoNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Student Directory</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View and search all registered students</p>
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', animationDelay: '0.05s' }}>
        <input type="text" placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} className="input-premium" style={{ maxWidth: '300px' }} />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="select-premium" style={{ maxWidth: '180px' }}>
          <option value="">All Departments</option>
          {departments.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading students...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👨‍🎓" title="No students found" description="No students match your search criteria." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map((student, i) => (
            <div key={student._id || i} className="card-premium animate-fade-in-up" style={{ padding: '1.25rem', animationDelay: `${0.1 + i * 0.02}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0
                }}>{getInitials(student.user?.name)}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.user?.name || 'Student'}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.rollNumber || 'N/A'}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Dept:</span> <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{student.department || '—'}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>CGPA:</span> <span style={{ color: 'var(--accent-hover)', fontWeight: '700' }}>{student.cgpa || '—'}</span></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Batch:</span> <span style={{ color: 'var(--text-secondary)' }}>{student.batch || '—'}</span></div>
                <div>
                  <span style={{
                    fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: '600',
                    background: student.isPlaced ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                    color: student.isPlaced ? '#86efac' : '#fcd34d',
                    border: `1px solid ${student.isPlaced ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`
                  }}>{student.isPlaced ? 'Placed' : 'Not Placed'}</span>
                </div>
              </div>
              {student.skills?.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {student.skills.slice(0, 4).map(s => (
                    <span key={s} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{s}</span>
                  ))}
                  {student.skills.length > 4 && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{student.skills.length - 4}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDirectory;
