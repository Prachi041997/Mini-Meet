const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path')


const {addUser, getUser, getUsersInRoom, removeUser} = require('./user')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
const authRoute = require('./routes/auth');

app.set('view engine', 'ejs')



app.use('/peerjs', peerServer);
app.use(express.static('public'))
app.use('/peerjs', peerServer);
app.use('/', authRoute);
app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/createRoom', (req, res)=> {
  res.json({
    room: uuidV4()
  })
})

io.on('connection', socket=> {
  console.log('user connected');
  let userid;
  socket.on('join-room', ({room, userId, name})=> {
    userid = userId
    console.log(room, userId, name);
    const {error, user} = addUser({id:userId, name:name, room: room});
    console.log(user);
    console.log(error);
   if(user) socket.join(user.room);
    io.to(user.room).emit('user-connected', {users: getUsersInRoom(user.room)});
    socket.to(user.room).broadcast.emit('user-video', userId) 

    socket.on('message', (message)=> {
      console.log(name);
      console.log(message);
      io.to(room).emit('createMessage', {message, name, userId})
    })
  })
   socket.on('removeScreen', (myId)=> {
     const user = getUser(myId);
    socket.to(user.room).broadcast.emit('removedScreen', {msg:`${myId} has removed screen Share`})
    
   })
 
  socket.on('disconnect', () => {
    console.log('userDisconnedted');
    const user = removeUser(userid);
    console.log(user);
    if(user) {
    socket.to(user.room).broadcast.emit('user-disconnected', user.id)

      // io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('user-connected', { users: getUsersInRoom(user.room)});
    }
  })
})


if(process.env.NODE_ENV === 'production' ||  process.env.NODE_ENV === 'staging'){
  app.use(express.static('client/build'))

  app.get('*', (req, res)=> {
      res.sendFile(path.join(__dirname + '/client/build/index.html'));
  })
}
server.listen(process.env.PORT||3030)