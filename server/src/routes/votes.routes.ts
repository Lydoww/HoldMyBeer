import express from 'express'
import authenticateToken from '../middlewares/auth.middleware.js'
import { createVote, deleteVote, getVotes, updateVote } from '../controllers/votes.controllers.js'
import { validateMiddleware } from '../middlewares/validate.middleware.js'
import { voteSchema } from '../validators/votes.schema.js'

const router = express.Router()

router.get('/votes', authenticateToken, getVotes)

router.post('/bets/:id/votes', authenticateToken, validateMiddleware(voteSchema), createVote)

router.patch('/votes/:id', authenticateToken, validateMiddleware(voteSchema), updateVote)

router.delete('/votes/:id', authenticateToken, deleteVote)

export default router