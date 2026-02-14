import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/helpers';
import * as api from '../../services/apiService';

const companyNav = [
  { path: '/company/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/company/drives', label: 'My Drives', icon: '💼' },
  { path: '/company/applicants', label: 'Applicants', icon: '👥' },
  { path: '/company/profile', label: 'Company Profile', icon: '🏢' },
];

const defaultDrive = {
  title: '', description: '', type: 'Full-Time', location: '',
  salary: { ctc: '', stipend: '' },
  eligibilityCriteria: { minCGPA: '', allowedDepartments: [], maxBacklogs: 0 },
  deadline: '', positions: 1
};

const MyDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ ...defaultDrive });
  const [saving, setSaving] = useState(false);

  const loadDrives = async () => {
    try {
      const res = await api.getMyDrives();
      setDrives(res.data?.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { loadDrives(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createDrive(formData);
      setShowCreate(false);
      setFormData({ ...defaultDrive });
      loadDrives();
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
    setSaving(false);
  };

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

  return (
    <DashboardLayout navItems={companyNav}>
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>My Drives</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Create and manage your recruitment drives</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          + Post New Drive
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : drives.length === 0 ? (
        <EmptyState icon="💼" title="No drives posted" description="Post your first recruitment drive to start hiring." action="Post Drive" onAction={() => setShowCreate(true)} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {drives.map((drive, i) => (
            <div key={drive._id || i} className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: `${0.05 + i * 0.03}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{drive.title}</h3>
                <StatusBadge status={drive.status || 'Draft'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span>💰 {formatCurrency(drive.salary?.ctc)}</span>
                <span>📍 {drive.location || 'TBD'}</span>
                <span>📅 {formatDate(drive.deadline)}</span>
                <span>👥 {drive.applicationCount || 0} applicants</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={async () => { try { await api.togglePublish(drive._id); loadDrives(); } catch(e){} }} className="btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }}>
                  {drive.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={async () => { if (confirm('Delete?')) { try { await api.deleteDrive(drive._id); loadDrives(); } catch(e){} } }} className="btn-danger" style={{ fontSize: '0.8rem' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Post New Drive" width="600px">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Job Title *</label>
              <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required className="input-premium" placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="input-premium" rows="3" style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Type</label>
                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="select-premium">
                  <option value="Full-Time">Full-Time</option><option value="Internship">Internship</option><option value="Intern + FTE">Intern + FTE</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Location</label>
                <input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className="input-premium" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>CTC (₹)</label>
                <input type="number" value={formData.salary.ctc} onChange={e => setFormData(p => ({ ...p, salary: { ...p.salary, ctc: e.target.value } }))} className="input-premium" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Deadline</label>
                <input type="date" value={formData.deadline} onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))} className="input-premium" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Min CGPA</label>
                <input type="number" step="0.1" value={formData.eligibilityCriteria.minCGPA} onChange={e => setFormData(p => ({ ...p, eligibilityCriteria: { ...p.eligibilityCriteria, minCGPA: e.target.value } }))} className="input-premium" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Allowed Departments</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {departments.map(d => (
                  <button key={d} type="button" onClick={() => setFormData(p => ({
                    ...p, eligibilityCriteria: { ...p.eligibilityCriteria, allowedDepartments: p.eligibilityCriteria.allowedDepartments.includes(d) ? p.eligibilityCriteria.allowedDepartments.filter(x => x !== d) : [...p.eligibilityCriteria.allowedDepartments, d] }
                  }))} style={{
                    padding: '0.375rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    background: formData.eligibilityCriteria.allowedDepartments.includes(d) ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: `1px solid ${formData.eligibilityCriteria.allowedDepartments.includes(d) ? 'var(--accent)' : 'var(--border)'}`,
                    color: formData.eligibilityCriteria.allowedDepartments.includes(d) ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Posting...' : 'Post Drive'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default MyDrives;
