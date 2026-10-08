import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
