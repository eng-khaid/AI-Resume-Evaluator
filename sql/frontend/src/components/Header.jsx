// src/components/Header.jsx
// Day 5 — shows logged-in email, logout button, and admin link

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.brand}>Resume Evaluator</Link>

      <nav style={styles.nav}>
        {user ? (
          <>
            {/* Show Admin link only for admin users */}
            {user.role === 'admin' && (
              <Link to="/admin" style={styles.link}>Admin panel</Link>
            )}
            <span style={styles.email}>{user.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Log in</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    minHeight: '72px',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(148,163,184,0.2)',
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  },
  brand: {
    fontWeight: 700,
    fontSize: '1.15rem',
    color: '#0f172a',
    letterSpacing: '0.02em',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  link: {
    fontSize: '0.95rem',
    color: '#475569',
    textDecoration: 'none',
  },
  email: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  logoutBtn: {
    fontSize: '0.9rem',
    padding: '0.55rem 0.95rem',
    border: 'none',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #4338ca, #2563eb)',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(59,130,246,0.18)',
  },
}
