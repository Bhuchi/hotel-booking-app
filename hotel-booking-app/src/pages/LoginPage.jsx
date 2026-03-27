import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../lib/services'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await login(email, password)

    if (error) {
      setError(error.message)
    } else {
      navigate('/search')
    }
    setLoading(false)
  }

  return (
    <div className="page" style={styles.centered}>
      <div style={styles.header}>
        <h1 style={styles.logo}>BeBooked</h1>
        <p style={styles.tagline}>Your next stay, sorted.</p>
      </div>

      <form onSubmit={handleLogin} style={styles.form}>
        {error && <p className="error-msg">{error}</p>}

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="divider">or</div>

      <p style={styles.switchText}>
        Don't have an account?{' '}
        <Link to="/signup" style={styles.link}>Sign up</Link>
      </p>
    </div>
  )
}

const styles = {
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100dvh',
    maxWidth: 480,
    margin: '0 auto',
    padding: '24px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 56,
    fontFamily: 'Bebas Neue, sans-serif',
    color: 'var(--accent)',
    lineHeight: 1,
  },
  tagline: {
    color: 'var(--text-muted)',
    fontSize: 15,
    marginTop: 6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'var(--text-muted)',
  },
  link: {
    color: 'var(--accent)',
    fontWeight: 500,
  },
}
