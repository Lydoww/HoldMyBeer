import express from 'express'
import { createBet, deleteBet, getBets, getOneBet, updateBet } from '../controllers/bets.controllers.js'
import { createBetSchema, updateBetSchema } from '../validators/bets.schema.js';
import { validateMiddleware } from '../middlewares/validate.middleware.js';
import { upload } from '../lib/multer.js';

const router = express.Router()

router.get('/bets', getBets)

router.post('/bets', upload, validateMiddleware(createBetSchema), createBet)

router.get('/bets/:id', getOneBet)

router.delete('/bets/:id', deleteBet)

router.patch('/bets/:id', validateMiddleware(updateBetSchema), updateBet)

export default router