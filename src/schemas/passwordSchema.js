import { z } from "zod";

export const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'A senha atual deve conter pelo menos 6 caracteres.'),
    newPassword: z.string().min(6, 'A nova senha deve conter pelo menos 6 caracteres.'),
    confirmPassword: z.string().min(6, 'A confirmação de senha deve conter pelo menos 6 caracteres.'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Senha nova e confirmação devem ser iguais.',
    path: ['confirmPassword'],
});
