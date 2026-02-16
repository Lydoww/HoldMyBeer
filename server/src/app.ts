import authRoutes from './routes/auth.routes.js'
import betsRoutes from './routes/bets.routes.js'
import votesRoutes from './routes/votes.routes.js'
import userRoutes from './routes/user.routes.js'

import express from 'express'
import cors from 'cors'
import authenticateToken from './middlewares/auth.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

app.use('/api/auth', authRoutes)
app.use('/api', authenticateToken, betsRoutes)
app.use('/api', authenticateToken, votesRoutes)
app.use('/api', authenticateToken, userRoutes)

app.use(errorMiddleware)

export default app