import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5345;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())
app.use(morgan('dev'))

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    socket.broadcast.emit('message', {
      body: message,
      from: socket.id
    })
  })
})

app.use(express.static(join(__dirname, '../client/dist')))

server.listen(PORT);
console.log("Server listening on port", PORT);