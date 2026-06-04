import { io } from 'socket.io-client'
import { API_BASE } from './api.js'

// Conexión Socket.IO compartida para eventos en tiempo real.
export const socket = io(API_BASE, { autoConnect: true })
