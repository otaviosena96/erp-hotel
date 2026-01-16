import { z } from "zod"

export const hotelSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  city: z.string().min(2, { message: "A cidade deve ter pelo menos 2 caracteres." }),
  roomQuantity: z.coerce.number().int().positive({ message: "O número de quartos deve ser um número positivo." }),
})

export type HotelFormData = z.infer<typeof hotelSchema>
