import { z } from "zod";

export const formScheduling = z.object({
    id: z.string().optional(),
    client: z.string().min(1, "Cliente é obrigatório"),
    service: z.string().min(1, "Serviço é obrigatório"),
    dateStart: z.date(),
    dateEnd: z.date(),
    status: z.string().optional(),
})