import express from 'express'
import authenticateToken from '../middlewares/auth.middleware.js'
import { createBet, deleteBet, getBets, getOneBet, updateBet } from '../controllers/bets.controllers.js'
import { createBetSchema, updateBetSchema } from '../validators/bets.schema.js';
import { validateMiddleware } from '../middlewares/validate.middleware.js';

const router = express.Router()

router.get('/bets', authenticateToken, getBets)

router.post('/bets', authenticateToken, validateMiddleware(createBetSchema), createBet)

router.get('/bets/:id', authenticateToken, getOneBet)

router.delete('/bets/:id', authenticateToken, deleteBet)

router.patch('/bets/:id', authenticateToken, validateMiddleware(updateBetSchema), updateBet)

export default router