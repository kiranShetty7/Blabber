const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectToDb = require('./config/dbConnection')
const userRouter = require('./routers/userRouter')
const chatRouter = require('./routers/chatRouter')
const errorMiddleware = require('./middlewares/errorMiddleware')
const { Server } = require("socket.io");

const app = express()
connectToDb()
dotenv.config()

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
  })
);


const PORT = process.env.PORT || 4000

app.use(express.json());
app.use('/v1/user', userRouter);
app.use('/v1/chat', chatRouter);




app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler)

const appServer = app.listen(PORT, () => {
  console.log(`Blabber chat app server is operational on port ${PORT}.`)
})

const io = new Server(appServer, {
  pingTimeout: 30000,
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on("connection", (socket) => {
  console.log('Socket Connection established', socket.id)

  socket.on('appEntered', (userId) => {
    console.log(`${userId} has enterred blabber`)
    socket.join(userId)
    socket.emit('connected')
  })
  

  socket.on('chatEntered', (chatId) => {
    socket.join(chatId)
    console.log("User has joined the chat",chatId)
  })

  socket.on('newMessage', (chat) => {
    console.log('chat',"socket macja")
    if(!chat?.users)
    console.log('Users not present')

    chat?.users?.forEach(user => {
      if(user?._id === chat.sentBy) return

      socket.in(user._id).emit("message received",chat)
      
    });

  }) 

  
});
