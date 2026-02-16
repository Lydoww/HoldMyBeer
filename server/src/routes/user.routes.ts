import express from 'express'
import { leaderBoard } from '../controllers/user.controllers.js'

const router = express.Router()

router.get('/leaderboard', leaderBoard)

export default router