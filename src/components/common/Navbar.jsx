import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`;
  };

  const roleColorMap = {
    student: { text: '#a5b4fc' },
    tpo: { text: '#86efac' },
    company: { text: '#fcd34d' },
    admin: { text: '#fca5a5' },
  };

  const roleStyle = roleColorMap[user?.role] || roleColorMap.student;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'rgba(10, 10, 15, 0.6)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px'
      }}>
        {/* Logo */}
        <Link to={getDashboardPath()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.25)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/>
            </svg>
          </div>
          <span style={{
            fontSize: '1.25rem', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            CampusHire
          </span>
        </Link>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.375rem 0.75rem 0.375rem 0.5rem',
                background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8125rem', fontWeight: '700', color: 'white'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                    {user?.name}
                  </div>
                  <div style={{
                    fontSize: '0.6875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: roleStyle.text
                  }}>
                    {user?.role}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button onClick={handleLogout} className="btn-danger" style={{ padding: '0.5rem 1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '500',
                color: 'var(--text-secondary)', textDecoration: 'none',
                transition: 'color 0.2s'
              }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                Sign In
              </Link>
              <Link to="/register" style={{
                padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: '600',
                color: 'white', textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                borderRadius: '10px', transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)'
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
