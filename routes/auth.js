import { Router } from 'express'
import { login } from '../controllers/authController.js'

const router = Router()
// Explain controllers include the router logic. We include controllers to make everything neater instead of filling up our routers with code.
router.post('/login', login)

export default router
