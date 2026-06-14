import { z } from "zod";

export const formService = z.object({
    id: z.string().optional(),
    procedure: z.string().min(1, "Informe o procedimento."),
    price: z.string().min(1, "Informe o preço."),
    duration: z.string().min(1, "Informe a duração."),
    image: z.string().nullable().optional()
})