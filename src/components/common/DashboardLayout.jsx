import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';

const DashboardLayout = ({ children, navItems = [] }) => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => { dispatch(logoutUser()); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'background 0.3s, border 0.3s'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CampusHire</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} end={item.exact}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                  borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                <span style={{ fontSize: '1.15rem', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.7rem 1rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
            marginBottom: '0.5rem', transition: 'all 0.2s'
          }}>
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* User Info + Logout */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem',
            background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.8rem', fontWeight: '700'
            }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              padding: '4px', borderRadius: '6px', transition: 'color 0.2s'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '2rem', minHeight: '100vh', transition: 'background 0.3s' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
