import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SearchPage from './pages/SearchPage'
import MyBookingsPage from './pages/MyBookingsPage'

function ProtectedRoute({ user, children }) {
  if (user === undefined) return null // still loading
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute user={user}>
              <SearchPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute user={user}>
              <MyBookingsPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? '/search' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
