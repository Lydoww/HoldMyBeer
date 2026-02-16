import express from 'express'
import { createVote, deleteVote, getVotes, updateVote } from '../controllers/votes.controllers.js'
import { validateMiddleware } from '../middlewares/validate.middleware.js'
import { voteSchema } from '../validators/votes.schema.js'

const router = express.Router()

router.get('/votes', getVotes)
router.post('/bets/:id/votes', validateMiddleware(voteSchema), createVote)
router.patch('/votes/:id', validateMiddleware(voteSchema), updateVote)
router.delete('/votes/:id', deleteVote)

export default router