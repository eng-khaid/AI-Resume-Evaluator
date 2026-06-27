// src/pages/LoginPage.jsx
// Day 5 — calls POST /auth/login, stores JWT, redirects to /

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // POST /auth/login  →  { access_token, token_type }
      const response = await client.post('/auth/login', { email, password })
      // login() stores the token, fetches role from /auth/me
      await login(email, response.data.access_token)
      navigate('/')
    } catch (err) {
      // FastAPI returns { detail: '...' } on errors
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Log in</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 72px)',
    padding: '2rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.25rem',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(148,163,184,0.2)',
    boxShadow: '0 20px 60px rgba(15,23,42,0.08)',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#111827',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '0.9rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '14px',
    fontSize: '0.95rem',
    background: '#f8fafc',
  },
  error: {
    color: '#b91c1c',
    fontSize: '0.92rem',
    margin: '0.25rem 0',
    padding: '0.75rem 0.9rem',
    borderRadius: '12px',
    background: 'rgba(254,226,226,0.8)',
  },
  btn: {
    marginTop: '0.75rem',
    padding: '0.95rem 1.25rem',
    background: 'linear-gradient(135deg, #4338ca, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 14px 24px rgba(59,130,246,0.18)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    color: '#64748b',
  },
}
