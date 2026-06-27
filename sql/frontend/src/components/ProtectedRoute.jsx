// src/components/ProtectedRoute.jsx
// Day 5 — redirect unauthenticated users to /login
//
// Usage in App.jsx:
//   <Route path="/" element={<ProtectedRoute><EvaluatorPage /></ProtectedRoute>} />
//
// Why `replace`?
//   Without replace, the browser pushes /login onto the history stack.
//   Hitting the Back button would return to the protected page and
//   trigger another redirect — an infinite loop. replace swaps the
//   current entry instead of adding one, breaking the loop.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  // Not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in → render the protected page
  return children
}
