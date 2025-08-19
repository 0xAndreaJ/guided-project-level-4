import { Router } from 'express'
import { createSale, listSales, getSaleById, replaceSale, patchSale, deleteSale, salesSummary } from '../controllers/salesController.js'
import { validateBody } from '../middlewares/validateBody.js'
import { saleCreateSchema, saleUpdateSchema } from '../schemas/sales.js'

const router = Router()

router.post('/', validateBody(saleCreateSchema), createSale)
router.get('/', listSales)
router.get('/summary', salesSummary)
router.get('/:sale_id', getSaleById)
// Showcase difference between put or patch. Podes solo dejar el Put ya de perdida jajaja
router.put('/:sale_id', validateBody(saleCreateSchema), replaceSale)
router.patch('/:sale_id', validateBody(saleUpdateSchema), patchSale)
router.delete('/:sale_id', deleteSale)

export default router
