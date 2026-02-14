import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import router from './routes/userRoutes';
import { Server, Socket } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});