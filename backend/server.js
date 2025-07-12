import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import dbConnection from './dataBase/dbConnection.js';
import { initSocket } from './socket/socket.js';

dotenv.config();

const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Start the server
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
  dbConnection();
});

export {io};