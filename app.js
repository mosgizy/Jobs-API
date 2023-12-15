require('dotenv').config()
require('express-async-errors')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const authMiddleware = require('./middleware/auth')

app.set('trust proxy',1)
app.use(rateLimiter({
  windows: 15 * 60 * 1000,
  max:100
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
  res.send('Jobs Api')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authMiddleware,jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port,() => console.log(`Server listening on port ${port}`))
  } catch (error) {
    console.error(error)
  }
}

start()
