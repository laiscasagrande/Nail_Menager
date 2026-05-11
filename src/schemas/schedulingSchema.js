import { z } from "zod";

export const formScheduling = z.object({
    dateStart: z.date(),
    dateEnd: z.date(),
    event: z.string({ message: "campo obrigatório" }).min(3)
})