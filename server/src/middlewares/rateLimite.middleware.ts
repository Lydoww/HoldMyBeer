import { rateLimit } from 'express-rate-limit'

export const registerLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    limit: 2,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many register requests, wait a bit.',
    skip: () => process.env.NODE_ENV === 'test'
})

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: 'Too many login requests, wait a bit.',
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skip: () => process.env.NODE_ENV === 'test'
})

export const betCreationLimit = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 1,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many bet creation requests, wait a bit.',
    skip: () => process.env.NODE_ENV === 'test'
})