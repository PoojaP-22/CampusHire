import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/helpers';
import * as api from '../../services/apiService';

const tpoNav = [
  { path: '/tpo/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/tpo/drives', label: 'Manage Drives', icon: '💼' },
  { path: '/tpo/applications', label: 'Applications', icon: '📄' },
  { path: '/tpo/students', label: 'Students', icon: '👨‍🎓' },
  { path: '/tpo/reports', label: 'Reports', icon: '📈' },
];

const defaultDrive = {
  title: '', description: '', type: 'Full-Time', location: '',
  salary: { ctc: '', stipend: '' },
  eligibilityCriteria: { minCGPA: '', allowedDepartments: [], maxBacklogs: 0 },
  deadline: '', positions: 1, company: ''
};

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ ...defaultDrive });
  const [saving, setSaving] = useState(false);

  const loadDrives = async () => {
    try {
      const res = await api.getDrives({ status: 'all', limit: 100 });
      setDrives(res.data?.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadCompanies = async () => {
    try {
      const res = await api.getCompanies();
      setCompanies(res.data?.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadDrives(); loadCompanies(); }, []);

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

  const handleTogglePublish = async (id) => {
    try { await api.togglePublish(id); loadDrives(); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this drive?')) return;
    try { await api.deleteDrive(id); loadDrives(); }
    catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

  return (
    <DashboardLayout navItems={tpoNav}>
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Manage Drives</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Create, publish and manage placement drives</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          + Create Drive
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : drives.length === 0 ? (
        <EmptyState icon="💼" title="No drives yet" description="Create your first placement drive to get started." action="Create Drive" onAction={() => setShowCreate(true)} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {drives.map((drive, i) => (
            <div key={drive._id || i} className="card-premium animate-fade-in-up" style={{ padding: '1.25rem', animationDelay: `${0.05 + i * 0.03}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{drive.title}</h3>
                    <StatusBadge status={drive.status || 'Draft'} />
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>🏢 {drive.company?.name || 'N/A'}</span>
                    <span>💰 {formatCurrency(drive.salary?.ctc)}</span>
                    <span>📅 {formatDate(drive.deadline)}</span>
                    <span>📄 {drive.applicationCount || 0} applicants</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleTogglePublish(drive._id)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                    {drive.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(drive._id)} className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Drive Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Drive" width="650px">
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Company *</label>
              <select value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} required className="select-premium">
                <option value="">Select a company</option>
                {companies.map(c => (
                  <option key={c._id} value={c._id}>{c.companyName || c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Job Title *</label>
              <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required className="input-premium" placeholder="e.g. Software Developer" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="input-premium" rows="3" placeholder="Job description..." style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Type</label>
                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="select-premium">
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Intern + FTE">Intern + FTE</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Location</label>
                <input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className="input-premium" placeholder="e.g. Bangalore" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>CTC (₹)</label>
                <input type="number" value={formData.salary.ctc} onChange={e => setFormData(p => ({ ...p, salary: { ...p.salary, ctc: e.target.value } }))} className="input-premium" placeholder="e.g. 600000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Deadline</label>
                <input type="date" value={formData.deadline} onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))} className="input-premium" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Min CGPA</label>
                <input type="number" step="0.1" value={formData.eligibilityCriteria.minCGPA} onChange={e => setFormData(p => ({ ...p, eligibilityCriteria: { ...p.eligibilityCriteria, minCGPA: e.target.value } }))} className="input-premium" placeholder="e.g. 7.0" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Positions</label>
                <input type="number" value={formData.positions} onChange={e => setFormData(p => ({ ...p, positions: e.target.value }))} className="input-premium" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Allowed Departments</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {departments.map(d => (
                  <button key={d} type="button" onClick={() => {
                    setFormData(p => ({
                      ...p, eligibilityCriteria: {
                        ...p.eligibilityCriteria,
                        allowedDepartments: p.eligibilityCriteria.allowedDepartments.includes(d)
                          ? p.eligibilityCriteria.allowedDepartments.filter(x => x !== d)
                          : [...p.eligibilityCriteria.allowedDepartments, d]
                      }
                    }));
                  }} style={{
                    padding: '0.375rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    background: formData.eligibilityCriteria.allowedDepartments.includes(d) ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: `1px solid ${formData.eligibilityCriteria.allowedDepartments.includes(d) ? 'var(--accent)' : 'var(--border)'}`,
                    color: formData.eligibilityCriteria.allowedDepartments.includes(d) ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Creating...' : 'Create Drive'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageDrives;
