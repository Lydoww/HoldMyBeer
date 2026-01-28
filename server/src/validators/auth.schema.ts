import z from "zod";

const registerSchema = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string().min(6)
})

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export { registerSchema, loginSchema }