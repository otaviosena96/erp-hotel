import { z } from "zod"

const formSchema = z.object({
  hotelId: z.string().min(1, { message: "Selecione um hotel." }),
  checkIn: z.string().min(1, { message: "Data de check-in é obrigatória." }),
  checkOut: z.string().min(1, { message: "Data de check-out é obrigatória." }),
  responsibleName: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(100, { message: "O nome deve ter no máximo 100 caracteres." }),
})

export type ReservationFormData = z.infer<typeof formSchema>
export { formSchema }
