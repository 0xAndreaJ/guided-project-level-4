import { z } from 'zod'

export const customerCreateSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3)
})

export const customerUpdateSchema = customerCreateSchema
