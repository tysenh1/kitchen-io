import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSockets } from './api/v1/sockets/index.ts'

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

initSockets(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
