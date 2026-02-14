import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import router from './routes/userRoutes';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { sub } from './config/redis';
config();
const app = express();
const server = createServer(app);
const io = new Server(server,{

  cors: {
    origin: '*',
  }
});
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
io.on('connection', (socket: Socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});
sub.subscribe(process.env.CODE_EXECUTION_EVENT || "codeExecutionResponse", (err, count) => {
  if (err) {
    console.error("Failed to subscribe to Redis channel:", err);
    return;
  }
  console.log(`Subscribed to ${count} channel(s). Waiting for messages...`);
});
sub.on('message', (channel, message) => {
  console.log(`Received message from channel ${channel}: ${message}`);
  if(channel === (process.env.CODE_EXECUTION_EVENT || "codeExecutionResponse")) {
    const parsedMessage = JSON.parse(message);
    console.log(`Emitting code execution result to socket ${parsedMessage.socketId}:`);
    io.to(parsedMessage.socketId).emit('codeExecutionResult', parsedMessage);
    return;
  }
  console.warn(`Received message from unexpected channel: ${channel}`);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});