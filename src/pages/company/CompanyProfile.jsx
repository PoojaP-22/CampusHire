import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/common/DashboardLayout';
import * as api from '../../services/apiService';

const companyNav = [
  { path: '/company/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/company/drives', label: 'My Drives', icon: '💼' },
  { path: '/company/applicants', label: 'Applicants', icon: '👥' },
  { path: '/company/profile', label: 'Company Profile', icon: '🏢' },
];

const CompanyProfile = () => {
  const { user } = useSelector(s => s.auth);
  const [profile, setProfile] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateDetails({ name: profile.name, phone: profile.phone });
      setMessage('Profile updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(err.response?.data?.error || 'Failed'); }
    setSaving(false);
  };

  return (
    <DashboardLayout navItems={companyNav}>
      <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Company Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Update your company information</p>
      </div>

      {message && (
        <div className="animate-slide-down" style={{
          padding: '0.875rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem',
          background: message.includes('updated') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${message.includes('updated') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          color: message.includes('updated') ? '#4ade80' : '#f87171'
        }}>{message}</div>
      )}

      <div className="card-premium animate-fade-in-up" style={{ padding: '2rem', maxWidth: '600px', animationDelay: '0.05s' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Company Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input-premium" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Email</label>
              <input value={profile.email} disabled className="input-premium" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Phone</label>
              <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input-premium" placeholder="10-digit number" />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ width: 'auto', padding: '0.875rem 2.5rem' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
