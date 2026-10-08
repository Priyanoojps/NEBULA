import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { initSocket, disconnectSocket } from '../utils/socket'
import StarField from '../components/StarField'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import axios from 'axios'

export default function ChatPage() {
  const { user, token } = useAuthStore()
  const { fetchConversations, fetchUsers, setOnlineUsers, activeConversation, setActiveConversation } = useChatStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Set auth header
  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [token])

  // Init socket
  useEffect(() => {
    if (!user?.id) return
    const socket = initSocket(user.id)

    socket.on('users:online', (users) => setOnlineUsers(users))

    fetchConversations()
    fetchUsers()

    return () => disconnectSocket()
  }, [user?.id])

  const handleSelectConversation = (convo) => {
    setActiveConversation(convo)
    setMobileSidebarOpen(false)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      <StarField />

      {/* Layout: sidebar on RIGHT (as requested), chat on LEFT */}
      <div className="relative z-10 flex w-full h-full">

        {/* Chat area (left) */}
        <div
          className={`flex-1 h-full transition-all duration-300 ${
            !activeConversation ? 'flex items-center justify-center' : ''
          } ${mobileSidebarOpen ? 'hidden md:flex' : 'flex'}`}
        >
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onBack={() => {
                setActiveConversation(null)
                setMobileSidebarOpen(true)
              }}
            />
          ) : (
            /* Empty state */
            <div className="text-center px-8 animate-float">
              <div className="text-7xl mb-6">🌌</div>
              <h2 className="font-display text-2xl font-bold tracking-widest glow-text-pink mb-3">
                NEBULA
              </h2>
              <p className="text-nebula-muted font-mono text-sm max-w-xs mx-auto leading-relaxed">
                Select a constellation from your orbits, or explore the universe to find new celestial bodies.
              </p>
              <div className="mt-6 flex justify-center gap-2">
                {['✦', '◉', '✦', '◈', '✦'].map((s, i) => (
                  <span key={i} className="text-nebula-cyan/40 text-xs animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
                    {s}
                  </span>
                ))}
              </div>
              {/* Mobile: open sidebar button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden mt-6 nebula-btn-primary text-sm"
              >
                Open Galaxy Map
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-nebula-border" />

        {/* Sidebar (right) */}
        <div
          className={`h-full flex-shrink-0 transition-all duration-300 ${
            mobileSidebarOpen
              ? 'fixed inset-0 z-50 md:relative md:inset-auto'
              : 'hidden md:block'
          }`}
          style={{ width: mobileSidebarOpen ? '100%' : 320 }}
        >
          <Sidebar
            onSelectConversation={handleSelectConversation}
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </div>

        {/* Mobile: hamburger to open sidebar */}
        {!mobileSidebarOpen && activeConversation && (
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-nebula-navy border border-nebula-border flex items-center justify-center text-nebula-cyan"
          >
            ◉
          </button>
        )}
      </div>
    </div>
  )
}
