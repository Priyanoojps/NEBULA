import { create } from 'zustand'
import axios from 'axios'

const API = 'http://localhost:3000/api/chat'

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  users: [],
  onlineUsers: [],
  typingUsers: {},
  loading: false,

  fetchUsers: async () => {
    const { data } = await axios.get('http://localhost:3000/api/auth/users')
    set({ users: data })
  },

  fetchConversations: async () => {
    const { data } = await axios.get(`${API}/conversations`)
    set({ conversations: data })
  },

  openConversation: async (receiverId) => {
    set({ loading: true })
    const { data } = await axios.post(`${API}/conversation`, { receiverId })
    set({ activeConversation: data, loading: false })
    return data
  },

  fetchMessages: async (conversationId) => {
    const { data } = await axios.get(`${API}/messages/${conversationId}`)
    set({ messages: data })
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }))
    // update last message in conversations
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === message.conversationId
          ? { ...c, lastMessage: message, updatedAt: new Date() }
          : c
      ),
    }))
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setTyping: (conversationId, userId, isTyping) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: isTyping ? userId : null,
      },
    }))
  },

  setActiveConversation: (convo) => set({ activeConversation: convo }),
  clearMessages: () => set({ messages: [] }),
}))
