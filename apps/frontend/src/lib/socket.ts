import io, { type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../types'

const SOCKET_URL = `https://${import.meta.env.VITE_IP_ADDR}:3001`;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  // autoConnect: true,
  transports: ["websocket"],
  rejectUnauthorized: false,
  // forceNew: true
});

