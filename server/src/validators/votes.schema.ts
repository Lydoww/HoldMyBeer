import z from "zod"

const voteSchema = z.object({
    choice: z.enum(["success", "fail"])
})

export { voteSchema }