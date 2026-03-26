import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const BookingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export default function Navbar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <NavLink to="/search" style={navItemStyle} end>
        {({ isActive }) => (
          <span style={{ ...styles.item, color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
            <SearchIcon />
            <span style={styles.label}>Search</span>
          </span>
        )}
      </NavLink>

      <NavLink to="/bookings" style={navItemStyle}>
        {({ isActive }) => (
          <span style={{ ...styles.item, color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
            <BookingsIcon />
            <span style={styles.label}>My Bookings</span>
          </span>
        )}
      </NavLink>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        <span style={{ ...styles.item, color: 'var(--text-muted)' }}>
          <LogoutIcon />
          <span style={styles.label}>Logout</span>
        </span>
      </button>
    </nav>
  )
}

const navItemStyle = { textDecoration: 'none', flex: 1 }

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-height)',
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    maxWidth: 480,
    margin: '0 auto',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    transition: 'color 0.15s',
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  logoutBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
}
