import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import StarField from '../components/StarField'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login, register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    clearError()
  }

  const submit = async (e) => {
    e.preventDefault()
    let ok
    if (mode === 'login') ok = await login(form.email, form.password)
    else ok = await register(form.name, form.email, form.password)
    if (ok) navigate('/chat')
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <StarField />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-5xl tracking-widest glow-text-pink mb-1">
            NEBULA
          </h1>
          <p className="text-nebula-muted font-mono text-xs tracking-widest uppercase">
            Chat Across the Universe
          </p>
          {/* Decorative orbit lines */}
          <div className="flex justify-center mt-4">
            <div className="relative w-24 h-1">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nebula-pink to-transparent opacity-60" />
            </div>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-nebula-border"
          style={{
            background: 'linear-gradient(135deg, #070d2088, #0a162888)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px #ff2d7822, 0 0 120px #7b2fff11',
          }}
        >
          {/* Tabs */}
          <div className="flex rounded-lg overflow-hidden border border-nebula-border mb-8">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); clearError() }}
                className={`flex-1 py-2.5 font-display text-xs tracking-widest uppercase transition-all duration-300 ${
                  mode === m
                    ? 'bg-nebula-pink text-white'
                    : 'text-nebula-muted hover:text-nebula-cyan'
                }`}
              >
                {m === 'login' ? 'Enter Orbit' : 'Join Universe'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-nebula-muted font-mono text-xs mb-1.5 uppercase tracking-wider">
                  Your Cosmic Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="e.g. StarWalker"
                  className="nebula-input"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-nebula-muted font-mono text-xs mb-1.5 uppercase tracking-wider">
                Signal Frequency (Email)
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="you@universe.space"
                className="nebula-input"
                required
              />
            </div>

            <div>
              <label className="block text-nebula-muted font-mono text-xs mb-1.5 uppercase tracking-wider">
                Access Code
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                className="nebula-input"
                required
              />
            </div>

            {error && (
              <div className="text-nebula-pink text-sm font-mono bg-nebula-pink/10 border border-nebula-pink/30 rounded px-3 py-2">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-display text-sm tracking-widest uppercase transition-all duration-300 mt-2"
              style={{
                background: loading
                  ? '#2d1a40'
                  : 'linear-gradient(135deg, #ff2d78, #7b2fff)',
                color: '#fff',
                boxShadow: loading ? 'none' : '0 0 20px #ff2d7866',
              }}
            >
              {loading
                ? '⟳ Connecting...'
                : mode === 'login'
                ? '🚀 Launch into NEBULA'
                : '✦ Create Your Planet'}
            </button>
          </form>
        </div>

        <p className="text-center text-nebula-muted text-xs mt-6 font-mono">
          ✦ Every conversation becomes a constellation ✦
        </p>
      </div>
    </div>
  )
}
