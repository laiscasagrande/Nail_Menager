import { z } from "zod";

export const passwordSchema = z.object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'A nova senha deve conter pelo menos 6 caracteres.').optional(),
    confirmPassword: z.string().optional(),
})
