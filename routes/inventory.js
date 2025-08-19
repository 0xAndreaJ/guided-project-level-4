import { Router } from 'express'
import { createProduct, listProducts, getProductById, updateProduct, deleteProduct, adjustStock } from '../controllers/inventoryController.js'
import { validateBody } from '../middlewares/validateBody.js'
import { productCreateSchema, productUpdateSchema, stockAdjustSchema } from '../schemas/inventory.js'

const router = Router()

router.post('/', validateBody(productCreateSchema), createProduct)
router.get('/', listProducts)
router.get('/:product_id', getProductById)
router.put('/:product_id', validateBody(productUpdateSchema), updateProduct)
router.delete('/:product_id', deleteProduct)
router.post('/:product_id/adjust-stock', validateBody(stockAdjustSchema), adjustStock)

export default router
