import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../lib/services'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const BookingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export default function Navbar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <span style={styles.logo}>BeBooked</span>

        <div style={styles.links}>
          <NavLink to="/search" style={{ textDecoration: 'none' }} end>
            {({ isActive }) => (
              <span style={{ ...styles.link, color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                <SearchIcon />
                Search
              </span>
            )}
          </NavLink>

          <NavLink to="/bookings" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <span style={{ ...styles.link, color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                <BookingsIcon />
                My Bookings
              </span>
            )}
          </NavLink>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <span style={{ ...styles.link, color: 'var(--text-muted)' }}>
              <LogoutIcon />
              Logout
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-height)',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    zIndex: 100,
  },
  inner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 40px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 28,
    color: 'var(--accent)',
    letterSpacing: '0.04em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: 'var(--radius-input)',
    transition: 'color 0.15s, background 0.15s',
    cursor: 'pointer',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
}
