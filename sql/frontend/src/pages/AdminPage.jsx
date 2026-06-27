// src/pages/AdminPage.jsx
// Day 5 bonus — admin panel: list users, change roles, delete accounts
//
// Only reachable by users with role === 'admin'.
// The /admin/* endpoints also enforce this server-side (require_admin).

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function AdminPage() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const { user }              = useAuth()
  const navigate              = useNavigate()

  // Redirect non-admins immediately (belt-and-suspenders —
  // the Header already hides the link, but direct URL access works)
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
  }, [user, navigate])

  // Fetch all users on mount
  useEffect(() => {
    client.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleRole(email, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      await client.patch(`/admin/users/${encodeURIComponent(email)}/role`, { role: newRole })
      setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update role')
    }
  }

  async function deleteUser(email) {
    if (!confirm(`Delete ${email}? This cannot be undone.`)) return
    try {
      await client.delete(`/admin/users/${encodeURIComponent(email)}`)
      setUsers(users.filter(u => u.email !== email))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user')
    }
  }

  if (loading) return <div style={styles.page}>Loading…</div>
  if (error)   return <div style={styles.page}><p style={styles.error}>{error}</p></div>

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin panel</h1>
      <p style={styles.sub}>{users.length} user{users.length !== 1 ? 's' : ''}</p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email} style={styles.tr}>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...(u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser) }}>
                  {u.role}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => toggleRole(u.email, u.role)}
                  style={styles.actionBtn}
                  disabled={u.email === user.email}  // can't demote yourself
                >
                  {u.role === 'admin' ? 'Make user' : 'Make admin'}
                </button>
                <button
                  onClick={() => deleteUser(u.email)}
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  disabled={u.email === user.email}  // can't delete yourself
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  page: {
    maxWidth: '980px',
    margin: '0 auto',
    padding: '2.5rem 1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#0f172a',
  },
  sub: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '1.75rem',
  },
  error: {
    color: '#b91c1c',
    fontSize: '0.95rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 0.5rem',
  },
  th: {
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#475569',
    padding: '0.75rem 1rem',
  },
  tr: {
    background: '#fff',
    borderRadius: '22px',
    boxShadow: '0 16px 40px rgba(15,23,42,0.05)',
  },
  td: {
    padding: '0.95rem 1rem',
    fontSize: '0.95rem',
    color: '#334155',
    verticalAlign: 'middle',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.35rem 0.85rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  badgeAdmin: {
    background: '#e0f2fe',
    color: '#075985',
  },
  badgeUser: {
    background: '#f8fafc',
    color: '#475569',
  },
  actionBtn: {
    marginRight: '0.5rem',
    padding: '0.55rem 0.9rem',
    border: '1px solid rgba(148,163,184,0.5)',
    borderRadius: '14px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    background: '#f8fafc',
    color: '#334155',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },
  deleteBtn: {
    color: '#b91c1c',
    borderColor: '#fecaca',
    background: '#fff1f2',
  },
}
