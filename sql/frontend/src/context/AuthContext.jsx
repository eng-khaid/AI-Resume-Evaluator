// src/context/AuthContext.jsx
// Day 5 — global auth state accessible from any component
//
// Stores: { email, token, role } or null
// Provides: login(), logout(), user
//
// Why localStorage instead of just useState?
//   React state resets on page refresh. localStorage persists
//   across refreshes and new tabs — the user stays logged in.

import { createContext, useContext, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialise from localStorage so the user stays logged in
  // after a page refresh (lazy initial state — runs once only)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('userEmail')
    const role  = localStorage.getItem('userRole')
    return token ? { email, token, role } : null
  })

  // Called after a successful /auth/login or /auth/register
  async function login(email, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('userEmail', email)

    // Fetch the role from /auth/me so we know whether to
    // show the Admin panel link in the Header
    let role = 'user'
    try {
      const res = await client.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      role = res.data.role
    } catch (_) {
      // If /me fails just default to 'user' — not a blocker
    }

    localStorage.setItem('userRole', role)
    setUser({ email, token, role })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook — use this in every component that needs auth state:
//   const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
