import z from "zod"

const createBetSchema = z.object({
    title: z.string().min(5),
    description: z.string().optional(),
})

const updateBetSchema = createBetSchema.partial().extend({
    status: z.enum(['success', 'failed']).optional()
})

export { createBetSchema, updateBetSchema }