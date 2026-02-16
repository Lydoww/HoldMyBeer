import express from 'express'
import { login, me, register } from '../controllers/auth.controllers.js'
import { validateMiddleware } from '../middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../validators/auth.schema.js'
import authenticateToken from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/me', authenticateToken, me)
router.post('/register', validateMiddleware(registerSchema), register)
router.post('/login', validateMiddleware(loginSchema), login)

export default router