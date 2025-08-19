import { Router } from 'express'
import { createCustomer, listCustomers, getCustomerById, updateCustomer, deleteCustomer, listCustomerSales } from '../controllers/customersController.js'
import { validateBody } from '../middlewares/validateBody.js'
import { customerCreateSchema, customerUpdateSchema } from '../schemas/customers.js'

const router = Router()

router.post('/', validateBody(customerCreateSchema), createCustomer)
router.get('/', listCustomers)
router.get('/:customer_id', getCustomerById)
router.put('/:customer_id', validateBody(customerUpdateSchema), updateCustomer)
router.delete('/:customer_id', deleteCustomer)
router.get('/:customer_id/sales', listCustomerSales)

export default router
