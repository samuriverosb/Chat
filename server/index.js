import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';

const PORT = process.env.PORT || 5345;
const app = express();
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



server.listen(PORT);
console.log("Server listening on port", PORT);