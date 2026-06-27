// src/pages/RegisterPage.jsx
// Day 5 — calls POST /auth/register, then auto-logs in

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // POST /auth/register  →  { message: 'Registered successfully' }
      await client.post('/auth/register', { email, password })

      // Auto-login after registration — better UX than forcing
      // the user to fill in the login form again
      const loginRes = await client.post('/auth/login', { email, password })
      await login(email, loginRes.data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create account</h1>

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
            minLength={6}
            style={styles.input}
          />

          <label style={styles.label}>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Log in</Link>
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
