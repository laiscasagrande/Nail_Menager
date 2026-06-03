import { z } from "zod";

export const formService = z.object({
    id: z.string().optional(),
    procedure: z.string(),
    price: z.string(),
    duration: z.string(),
    image: z.string().nullable().optional()
})