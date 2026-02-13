import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import * as api from '../../services/apiService';

const studentNav = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/student/drives', label: 'Browse Drives', icon: '💼' },
  { path: '/student/applications', label: 'My Applications', icon: '📄' },
  { path: '/student/profile', label: 'My Profile', icon: '👤' },
];

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    rollNumber: '', department: '', batch: '', cgpa: '',
    tenthPercentage: '', twelfthPercentage: '', skills: [],
    resume: { url: '' }, linkedIn: '', github: '', about: '',
  });
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getMyProfile();
        if (res.data?.data) setProfile(prev => ({ ...prev, ...res.data.data }));
      } catch (err) { /* new profile */ }
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateProfile(profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML', 'CSM', 'CSD'];

  if (loading) return <DashboardLayout navItems={studentNav}><div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout navItems={studentNav}>
      <div className="animate-fade-in-up">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Complete your profile to get matched with drives</p>
      </div>

      {message && (
        <div className="animate-slide-down" style={{
          padding: '0.875rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem',
          background: message.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${message.includes('success') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          color: message.includes('success') ? '#4ade80' : '#f87171'
        }}>{message}</div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Academic Section */}
          <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.05s' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎓 Academic Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Roll Number</label>
                <input name="rollNumber" value={profile.rollNumber} onChange={handleChange} className="input-premium" placeholder="e.g. 21CS101" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Department</label>
                <select name="department" value={profile.department} onChange={handleChange} className="select-premium">
                  <option value="">Select</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Batch</label>
                <input name="batch" value={profile.batch} onChange={handleChange} className="input-premium" placeholder="e.g. 2025" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>CGPA</label>
                <input name="cgpa" type="number" step="0.01" value={profile.cgpa} onChange={handleChange} className="input-premium" placeholder="e.g. 8.5" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>10th %</label>
                <input name="tenthPercentage" type="number" step="0.1" value={profile.tenthPercentage} onChange={handleChange} className="input-premium" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>12th %</label>
                <input name="twelfthPercentage" type="number" step="0.1" value={profile.twelfthPercentage} onChange={handleChange} className="input-premium" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Skills */}
            <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛠 Skills
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} className="input-premium" placeholder="Add a skill"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} style={{ flex: 1 }} />
                <button type="button" onClick={handleAddSkill} className="btn-primary" style={{ width: 'auto', padding: '0.7rem 1.25rem' }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.map(skill => (
                  <span key={skill} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc'
                  }}>
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>×</button>
                  </span>
                ))}
                {profile.skills.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No skills added yet</p>}
              </div>
            </div>

            {/* Links */}
            <div className="card-premium animate-fade-in-up" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔗 Links & About
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>LinkedIn</label>
                  <input name="linkedIn" value={profile.linkedIn || ''} onChange={handleChange} className="input-premium" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>GitHub</label>
                  <input name="github" value={profile.github || ''} onChange={handleChange} className="input-premium" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>About Me</label>
                  <textarea name="about" value={profile.about} onChange={handleChange} className="input-premium" rows="3" placeholder="Brief about yourself..." style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} className="btn-primary" style={{ width: 'auto', padding: '0.875rem 2.5rem' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default StudentProfile;
