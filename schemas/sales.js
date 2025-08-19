import { z } from 'zod'

export const saleCreateSchema = z.object({
  customer_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  sale_date: z.string().min(1)
})

export const saleUpdateSchema = saleCreateSchema.partial().refine(d => Object.keys(d).length > 0)
