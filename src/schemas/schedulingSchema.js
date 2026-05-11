import { z } from "zod";

export const formScheduling = z.object({
    dateStart: z.date(),
    dateEnd: z.date(),
    client: z.string().min(1, "Selecione um cliente"),
})