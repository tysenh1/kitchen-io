import 'dotenv/config';
import app from './app.ts';
import { createServer } from 'https';
import { Server } from 'socket.io';
import { initSockets } from './api/v1/sockets/index.ts'
import fs from 'fs';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

const server = createServer(options, app);

const io = new Server(
  server,
  {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  }
);

initSockets(io);

// const PORT = process.env.PORT || 3001;
const PORT = 3001
const IP_ADDR = process.env.IP_ADDR
server.listen(PORT, IP_ADDR, () => {
  console.log(`Server is running on port ${PORT}`);
})
