import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Insert into users table after auth signup
    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    navigate('/search')
    setLoading(false)
  }

  return (
    <div className="page" style={styles.centered}>
      <div style={styles.header}>
        <h1 style={styles.logo}>BeBooked</h1>
        <p style={styles.tagline}>Create your account</p>
      </div>

      <form onSubmit={handleSignup} style={styles.form}>
        {error && <p className="error-msg">{error}</p>}

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label className="label">First Name</label>
            <input
              className="input"
              name="firstName"
              placeholder="Jane"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Last Name</label>
            <input
              className="input"
              name="lastName"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="divider">or</div>

      <p style={styles.switchText}>
        Already have an account?{' '}
        <Link to="/login" style={styles.link}>Sign in</Link>
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
    paddingBottom: 24,
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
  row: {
    display: 'flex',
    gap: 12,
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
