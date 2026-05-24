import { z } from "zod";

export const formScheduling = z.object({
    id: z.string().optional(),
    client: z.string(),
    service: z.string(),
    dateStart: z.date(),
    dateEnd: z.date(),
    status: z.string().optional(),
})