const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectToDb = require('./config/dbConnection')
const userRouter = require('./routers/userRouter')
const chatRouter = require('./routers/chatRouter')
const errorMiddleware = require('./middlewares/errorMiddleware')

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

app.listen(PORT, () => {
  console.log(`Blabber chat app server is operational on port ${PORT}.`)
})