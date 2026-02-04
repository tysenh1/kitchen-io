import { Server, Socket } from 'socket.io';
import { registerChatHandlers } from './chatHandler.ts';
import { registerBarcodeHandlers } from './barcodeHandler.ts';

export const initSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Connection established: ${socket.id}`);

    // 1. Send the initial welcome message immediately
    socket.emit('ai_stream', "Hey there! 👋 Chef-OS is ready. What are we cooking, or do you have something to scan?");
    socket.emit('stream_done');

    // 2. Register the Chat Logic (History lives inside this function per-socket)
    registerChatHandlers(socket);

    // 3. Register the Barcode Logic (SQLite/Open Food Facts lookups)
    registerBarcodeHandlers(socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
