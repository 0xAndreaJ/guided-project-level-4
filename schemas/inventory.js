import { z } from 'zod'

export const productCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  stock_quantity: z.number().int().min(0)
})

export const productUpdateSchema = productCreateSchema

export const stockAdjustSchema = z.object({
  change: z.number().int()
})
