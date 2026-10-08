import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import PlanetAvatar from './PlanetAvatar'

export default function Sidebar({ onSelectConversation, mobileOpen, onClose }) {
  const { user, logout } = useAuthStore()
  const { conversations, users, onlineUsers, openConversation, fetchMessages, setActiveConversation } = useChatStore()
  const [tab, setTab] = useState('chats') // chats | explore | status
  const [search, setSearch] = useState('')

  const handleUserClick = async (u) => {
    const convo = await openConversation(u._id)
    await fetchMessages(convo._id)
    onSelectConversation(convo)
    onClose?.()
  }

  const handleConvoClick = async (convo) => {
    setActiveConversation(convo)
    await fetchMessages(convo._id)
    onSelectConversation(convo)
    onClose?.()
  }

  const getOtherParticipant = (convo) => {
    return convo.participants?.find((p) => p._id !== user?.id) || {}
  }

  const filteredConvos = conversations.filter((c) => {
    const other = getOtherParticipant(c)
    return other.name?.toLowerCase().includes(search.toLowerCase())
  })

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className={`flex flex-col h-full border-r border-nebula-border relative z-20 transition-all duration-300 ${
        mobileOpen ? 'translate-x-0' : ''
      }`}
      style={{
        background: 'linear-gradient(180deg, #070d20 0%, #050a1a 100%)',
        width: '100%',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-nebula-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-black text-xl tracking-widest glow-text-pink">
            NEBULA
          </h1>
          <button
            onClick={logout}
            className="text-nebula-muted hover:text-nebula-pink transition-colors text-xs font-mono"
          >
            EJECT
          </button>
        </div>

        {/* My planet */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-nebula-navy/50 border border-nebula-border">
          <PlanetAvatar name={user?.name || 'U'} size={42} online={true} />
          <div className="flex-1 min-w-0">
            <p className="text-nebula-text font-medium text-sm truncate">{user?.name}</p>
            <p className="text-nebula-cyan text-xs font-mono">● Your Planet · Online</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nebula-muted text-sm">✦</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the galaxy..."
            className="nebula-input pl-8 text-xs py-2"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-nebula-border">
        {[
          { id: 'chats', label: 'Orbits', icon: '◉' },
          { id: 'explore', label: 'Explore', icon: '✦' },
          { id: 'status', label: 'Status', icon: '◈' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-xs font-mono tracking-wider transition-all duration-200 ${
              tab === t.id
                ? 'text-nebula-cyan border-b-2 border-nebula-cyan'
                : 'text-nebula-muted hover:text-nebula-text'
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'chats' && (
          <div>
            {filteredConvos.length === 0 ? (
              <div className="p-6 text-center text-nebula-muted text-sm font-mono">
                <div className="text-3xl mb-2">🌌</div>
                <p>No orbits yet.</p>
                <p className="text-xs mt-1">Explore the galaxy to connect!</p>
              </div>
            ) : (
              filteredConvos.map((convo) => {
                const other = getOtherParticipant(convo)
                const isOnline = onlineUsers.includes(other._id)
                return (
                  <div
                    key={convo._id}
                    onClick={() => handleConvoClick(convo)}
                    className="flex items-center gap-3 p-4 hover:bg-nebula-navy/40 cursor-pointer border-b border-nebula-border/30 transition-all duration-150 group"
                  >
                    <PlanetAvatar name={other.name || '?'} size={46} online={isOnline} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-nebula-text font-medium text-sm truncate group-hover:text-nebula-cyan transition-colors">
                          {other.name}
                        </p>
                        <span className="text-nebula-muted text-xs font-mono flex-shrink-0 ml-2">
                          {convo.lastMessage
                            ? new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>
                      <p className="text-nebula-muted text-xs truncate mt-0.5">
                        {convo.lastMessage?.content || 'Start your constellation...'}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {tab === 'explore' && (
          <div>
            <p className="text-nebula-muted text-xs font-mono px-4 py-3 uppercase tracking-wider">
              — Celestial Bodies —
            </p>
            {filteredUsers.map((u) => {
              const isOnline = onlineUsers.includes(u._id)
              return (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u)}
                  className="flex items-center gap-3 p-4 hover:bg-nebula-navy/40 cursor-pointer border-b border-nebula-border/30 transition-all group"
                >
                  <PlanetAvatar name={u.name} size={46} online={isOnline} />
                  <div className="flex-1">
                    <p className="text-nebula-text text-sm font-medium group-hover:text-nebula-cyan transition-colors">
                      {u.name}
                    </p>
                    <p className={`text-xs font-mono ${isOnline ? 'text-nebula-cyan' : 'text-nebula-muted'}`}>
                      {isOnline ? '● In orbit' : '○ Dark side'}
                    </p>
                  </div>
                  <span className="text-nebula-muted group-hover:text-nebula-pink text-lg transition-colors">→</span>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'status' && (
          <div className="p-4 space-y-3">
            <p className="text-nebula-muted text-xs font-mono uppercase tracking-wider mb-4">
              — Cosmic Signals —
            </p>
            {/* My status */}
            <div className="p-3 rounded-xl border border-nebula-pink/30 bg-nebula-pink/5">
              <div className="flex items-center gap-3">
                <PlanetAvatar name={user?.name || 'U'} size={40} online={true} showRing={false} />
                <div>
                  <p className="text-nebula-text text-sm font-medium">My Signal</p>
                  <p className="text-nebula-pink text-xs font-mono">+ Add cosmic status</p>
                </div>
              </div>
            </div>

            {/* Online users status */}
            {users.filter(u => onlineUsers.includes(u._id)).map((u) => (
              <div key={u._id} className="p-3 rounded-xl border border-nebula-border bg-nebula-navy/30">
                <div className="flex items-center gap-3">
                  <PlanetAvatar name={u.name} size={40} online={true} showRing={false} />
                  <div>
                    <p className="text-nebula-text text-sm font-medium">{u.name}</p>
                    <p className="text-nebula-cyan text-xs font-mono">● Active in the universe</p>
                  </div>
                </div>
              </div>
            ))}

            {onlineUsers.length === 0 && (
              <div className="text-center py-8 text-nebula-muted text-sm font-mono">
                <div className="text-3xl mb-2">🌑</div>
                <p>The universe is quiet...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
