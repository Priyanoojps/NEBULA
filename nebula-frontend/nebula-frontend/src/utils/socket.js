import { io } from 'socket.io-client'

let socket = null

export const initSocket = (userId) => {
  socket = io('http://localhost:3000', { transports: ['websocket'] })
  socket.on('connect', () => {
    socket.emit('user:online', userId)
  })
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) socket.disconnect()
}
