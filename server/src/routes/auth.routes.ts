import express from 'express'
import { login, register } from '../controllers/auth.controllers.js'
import { validateMiddleware } from '../middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../validators/auth.schema.js'

const router = express.Router()

router.post('/register', validateMiddleware(registerSchema), register)
router.post('/login', validateMiddleware(loginSchema), login)

export default router