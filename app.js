const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { joinUser, getCurrentUser, userDisconnect } = require('./src/users');

const port = process.env.PORT;

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.send('Adoro gatos');
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, roomname }) => {
    const user = joinUser(socket.id, username, roomname);
    socket.join(user.roomname);

    socket.emit('message', {
      userId: user.id,
      username: user.username,
      text: `Welcome to Cakey, ${user.username}`,
      fromServer: true,
      userColor: user.userColor,
      createdAt: new Date(),
    });

    socket.broadcast.to(user.roomname).emit('message', {
      userId: user.id,
      username: user.username,
      text: `${user.username} has joined the chat`,
      fromServer: true,
      userColor: user.userColor,
      createdAt: new Date(),
    });
  });

  socket.on('chat', (text) => {
    const user = getCurrentUser(socket.id);

    console.log('message:', text);

    io.to(user.roomname).emit('message', {
      userId: user.id,
      username: user.username,
      text: text,
      fromServer: false,
      userColor: user.userColor,
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    const user = userDisconnect(socket.id);

    if (user) {
      io.to(user.roomname).emit('message', {
        userId: user.id,
        username: user.username,
        text: `${user.username} has left the room`,
        fromServer: true,
        userColor: user.userColor,
        createdAt: new Date(),
      });
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
