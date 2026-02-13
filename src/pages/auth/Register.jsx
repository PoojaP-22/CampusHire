import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../redux/slices/authSlice';

const roles = [
  { value: 'student', label: 'Student', icon: '🎓', desc: 'Apply for placements' },
  { value: 'tpo', label: 'TPO', icon: '🏛️', desc: 'Manage drives' },
  { value: 'company', label: 'Company', icon: '🏢', desc: 'Hire talent' },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      switch (role) {
        case 'student': navigate('/student/dashboard'); break;
        case 'tpo': navigate('/tpo/dashboard'); break;
        case 'company': navigate('/company/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    }
  };

  return (
    <div className="noise-overlay" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'var(--bg-primary)', padding: '2rem 0' }}>
      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', padding: '1.5rem' }}>
        {/* Logo */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 1.25rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.025em' }}>
            <span className="gradient-text">Create Account</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>
            Join the placement ecosystem
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', animationDelay: '0.1s' }}>
          <div style={{
            width: '32px', height: '4px', borderRadius: '4px',
            background: step >= 1 ? 'var(--accent)' : 'var(--border)',
            transition: 'background 0.4s ease'
          }} />
          <div style={{
            width: '32px', height: '4px', borderRadius: '4px',
            background: step >= 2 ? 'var(--accent)' : 'var(--border)',
            transition: 'background 0.4s ease'
          }} />
        </div>

        {/* Card */}
        <div className="glass animate-fade-in-up" style={{
          borderRadius: '20px', padding: '2.25rem',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          animationDelay: '0.15s'
        }}>
          {/* Error */}
          {error && (
            <div className="animate-slide-down" style={{
              marginBottom: '1.25rem', padding: '0.875rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px', color: '#fca5a5', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {error}
            </div>
          )}

          {/* STEP 1: Role & Basic Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="animate-fade-in">
              {/* Role Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.025em' }}>
                  I am a...
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => handleRoleSelect(r.value)}
                      style={{
                        padding: '1rem 0.5rem',
                        background: formData.role === r.value ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1.5px solid ${formData.role === r.value ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'center',
                        transform: formData.role === r.value ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: formData.role === r.value ? '0 4px 20px rgba(99,102,241,0.15)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>{r.icon}</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: formData.role === r.value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{r.label}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="input-premium" placeholder="John Doe" style={{ paddingLeft: '2.75rem' }} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="input-premium" placeholder="you@university.edu" style={{ paddingLeft: '2.75rem' }} />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Phone <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}"
                    className="input-premium" placeholder="10-digit number" style={{ paddingLeft: '2.75rem' }} />
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Continue →
              </button>
            </form>
          )}

          {/* STEP 2: Password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <button type="button" onClick={() => setStep(1)} style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer', marginBottom: '1.25rem',
                transition: 'color 0.2s', fontFamily: 'Inter, sans-serif'
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                Back
              </button>

              {/* Welcome Banner */}
              <div style={{
                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)',
                borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Almost there, <strong style={{ color: 'var(--text-primary)' }}>{formData.name || 'User'}</strong>!
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>Set a secure password to protect your account</p>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleChange} required
                    className="input-premium" placeholder="Min 6 characters"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0
                  }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.375rem' }}>
                    {[1, 2, 3, 4].map((i) => {
                      const strength = formData.password.length >= 12 ? 4 : formData.password.length >= 8 ? 3 : formData.password.length >= 6 ? 2 : 1;
                      const colors = ['#ef4444', '#f59e0b', '#22c55e', '#6366f1'];
                      return (
                        <div key={i} style={{
                          flex: 1, height: '3px', borderRadius: '3px',
                          background: i <= strength ? colors[strength - 1] : 'var(--border)',
                          transition: 'background 0.3s ease'
                        }} />
                      );
                    })}
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {formData.password.length < 6 ? 'Too short' : formData.password.length < 8 ? 'Fair' : formData.password.length < 12 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </span>
                  <input
                    type="password" name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} required
                    className="input-premium" placeholder="Re-enter password"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                  {formData.confirmPassword && (
                    <span style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      color: formData.password === formData.confirmPassword ? 'var(--success)' : 'var(--danger)',
                      transition: 'color 0.3s'
                    }}>
                      {formData.password === formData.confirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin-slow 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-hover)', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#c4b5fd'}
              onMouseLeave={(e) => e.target.style.color = 'var(--accent-hover)'}
            >
              Sign in →
            </Link>
          </p>
        </div>

        <p className="animate-fade-in" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2rem', animationDelay: '0.3s' }}>
          Placement & Career Tracking Portal
        </p>
      </div>
    </div>
  );
};

export default Register;
