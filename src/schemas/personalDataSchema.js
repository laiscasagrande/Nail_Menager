import { z } from "zod";

export const personalDataSchema = z.object({
    name: z.string().min(2, 'O nome deve conter pelo menos 2 caracteres.').max(100, 'O nome não pode exceder 100 caracteres.'),
    email: z.string().email('Digite um email válido.'),
})
