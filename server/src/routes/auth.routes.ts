import express from 'express'
import { login, me, register } from '../controllers/auth.controllers.js'
import { validateMiddleware } from '../middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../validators/auth.schema.js'
import authenticateToken from '../middlewares/auth.middleware.js'
import { loginLimit, registerLimit } from '../middlewares/rateLimite.middleware.js'

const router = express.Router()

router.get('/me', authenticateToken, me)
router.post('/register', registerLimit, validateMiddleware(registerSchema), register)
router.post('/login', loginLimit, validateMiddleware(loginSchema), login)

export default router