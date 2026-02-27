import express from 'express'
import { createBet, deleteBet, getBets, getBetsCursor, getOneBet, updateBet } from '../controllers/bets.controllers.js'
import { createBetSchema, updateBetSchema } from '../validators/bets.schema.js';
import { validateMiddleware } from '../middlewares/validate.middleware.js';
import { upload } from '../lib/multer.js';
import { betCreationLimit } from '../middlewares/rateLimite.middleware.js';

const router = express.Router()

router.get('/bets', getBets)
router.get('/bets/cursor', getBetsCursor)

router.post('/bets', betCreationLimit, upload, validateMiddleware(createBetSchema), createBet)

router.get('/bets/:id', getOneBet)

router.delete('/bets/:id', deleteBet)

router.patch('/bets/:id', validateMiddleware(updateBetSchema), updateBet)

export default router