import { z } from "zod";

export const formCustomer = z.object({
    id: z.string().optional(),
    name: z.string(),
    telephone: z.string(),
    observation: z.string().optional()
})