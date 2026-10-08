import React, { useState, useEffect, useRef } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { getSocket } from '../utils/socket'
import PlanetAvatar from './PlanetAvatar'

export default function ChatWindow({ conversation, onBack }) {
  const { user } = useAuthStore()
  const { messages, addMessage, onlineUsers, typingUsers, setTyping } = useChatStore()
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [supernovas, setSupernovas] = useState([])
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)
  const socket = getSocket()

  const other = conversation?.participants?.find((p) => p._id !== user?.id) || {}
  const isOnline = onlineUsers.includes(other._id)
  const isTyping = typingUsers[conversation?._id]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!socket || !conversation) return
    socket.emit('conversation:join', conversation._id)

    socket.on('message:receive', (msg) => {
       console.log("MESSAGE RECEIVED IN FRONTEND:", msg)

  if (String(msg.conversationId) === String(conversation._id)) {
     console.log("ADDING MESSAGE TO CHAT:", msg)
    addMessage(msg)
  }
    })
    socket.on('typing:start', ({ userId }) => {
      if (userId !== user?.id) setTyping(conversation._id, userId, true)
    })
    socket.on('typing:stop', ({ userId }) => {
      setTyping(conversation._id, userId, false)
    })

    return () => {
      socket.off('message:receive')
      socket.off('typing:start')
      socket.off('typing:stop')
      socket.emit('conversation:leave', conversation._id)
    }
  }, [conversation?._id])

  const handleTyping = (e) => {
    setText(e.target.value)
    if (!socket) return
    socket.emit('typing:start', { conversationId: conversation._id, userId: user?.id, userName: user?.name })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId: conversation._id, userId: user?.id })
    }, 1500)
  }

  const sendMessage = () => {
    if (!text.trim() || !socket) return
    socket.emit('message:send', {
      conversationId: conversation._id,
      senderId: user?.id,
      content: text.trim(),
    })
    setText('')
    setShowEmoji(false)
    socket.emit('typing:stop', { conversationId: conversation._id, userId: user?.id })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const triggerSupernova = (msgId, x, y) => {
    const id = Date.now()
    setSupernovas((prev) => [...prev, { id, x, y }])
    setTimeout(() => setSupernovas((prev) => prev.filter((s) => s.id !== id)), 800)
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (!conversation) return null

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'linear-gradient(180deg, #050a1a 0%, #070d20 100%)' }}>

      {/* Supernova effects */}
      {supernovas.map((s) => (
        <div key={s.id} className="supernova-ring" style={{ left: s.x, top: s.y, zIndex: 50, position: 'fixed' }} />
      ))}

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-nebula-border z-10"
        style={{ background: '#070d20ee', backdropFilter: 'blur(10px)' }}
      >
        {/* Mobile back */}
        <button onClick={onBack} className="md:hidden text-nebula-muted hover:text-nebula-cyan mr-1 text-xl">
          ←
        </button>

        <PlanetAvatar name={other.name || '?'} size={44} online={isOnline} />

        <div className="flex-1 min-w-0">
          <p className="text-nebula-text font-medium text-sm">{other.name}</p>
          <p className={`text-xs font-mono ${isOnline ? 'text-nebula-cyan' : 'text-nebula-muted'}`}>
            {isTyping
              ? '✍ transmitting signal...'
              : isOnline
              ? '● In orbit'
              : '○ Dark side of the moon'}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full border border-nebula-border flex items-center justify-center text-nebula-muted hover:text-nebula-pink hover:border-nebula-pink transition-all text-sm">
            🔍
          </button>
          <button className="w-8 h-8 rounded-full border border-nebula-border flex items-center justify-center text-nebula-muted hover:text-nebula-cyan hover:border-nebula-cyan transition-all text-sm">
            ⋯
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-5xl mb-4 animate-float">🌌</div>
            <p className="text-nebula-muted font-mono text-sm">Begin your constellation</p>
            <p className="text-nebula-muted/50 text-xs mt-1">Every message becomes a star</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.sender?._id === user?.id || msg.sender === user?.id
          const senderName = msg.sender?.name || ''

          return (
            <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
              {!isMine && (
                <div className="mr-2 flex-shrink-0 self-end">
                  <PlanetAvatar name={senderName} size={28} showRing={false} online={false} />
                </div>
              )}

              <div className="max-w-xs md:max-w-md lg:max-w-lg relative">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed cursor-pointer ${
                    isMine ? 'msg-sent rounded-br-sm' : 'msg-received rounded-bl-sm'
                  }`}
                  onDoubleClick={(e) => triggerSupernova(msg._id, e.clientX, e.clientY)}
                >
                  <p className="text-nebula-text">{msg.content}</p>
                </div>

                <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-nebula-muted text-xs font-mono">{formatTime(msg.createdAt)}</span>
                  {isMine && (
                    <span className={`text-xs ${msg.seen ? 'text-nebula-cyan' : 'text-nebula-muted'}`}>
                      {msg.seen ? '✦✦' : '✦'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <PlanetAvatar name={other.name} size={28} showRing={false} online={true} />
            <div className="msg-received px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5 items-center">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={(e) => setText((t) => t + e.emoji)}
            theme="dark"
            skinTonesDisabled
            searchDisabled={false}
            height={350}
            width={300}
          />
        </div>
      )}

      {/* Input Bar */}
      <div
        className="px-4 py-3 border-t border-nebula-border z-10"
        style={{ background: '#070d20ee', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center gap-2">
          {/* Emoji */}
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-lg flex-shrink-0 ${
              showEmoji ? 'bg-nebula-pink/20 text-nebula-pink' : 'text-nebula-muted hover:text-nebula-cyan'
            }`}
          >
            ✦
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Transmit your signal..."
              rows={1}
              className="nebula-input resize-none py-2.5 pr-12 text-sm leading-5"
              style={{ minHeight: 44, maxHeight: 120 }}
            />
          </div>

          {/* Voice message */}
          <button className="w-9 h-9 rounded-full border border-nebula-border flex items-center justify-center text-nebula-muted hover:text-nebula-pink hover:border-nebula-pink transition-all text-sm flex-shrink-0">
            🎙
          </button>

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 font-bold"
            style={{
              background: text.trim()
                ? 'linear-gradient(135deg, #ff2d78, #7b2fff)'
                : '#1a2a4a',
              boxShadow: text.trim() ? '0 0 16px #ff2d7866' : 'none',
              color: text.trim() ? '#fff' : '#6b7fa8',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
