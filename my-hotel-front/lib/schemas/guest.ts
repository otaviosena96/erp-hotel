import { z } from "zod"

const formSchema = z.object({
  guestName: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(100, { message: "O nome deve ter no máximo 100 caracteres." }),
  document: z.string().min(5, { message: "O documento deve ter pelo menos 5 caracteres." }).max(20, { message: "O documento deve ter no máximo 20 caracteres." }),
  documentType: z.enum(["CPF", "PASSPORT"]),
  reservationId: z.string().min(1, { message: "ID da reserva é obrigatório." }),
})

export type GuestFormData = z.infer<typeof formSchema>
export { formSchema }
