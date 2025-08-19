import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import customersRouter from './routes/customers.js'
import inventoryRouter from './routes/inventory.js'
import salesRouter from './routes/sales.js'
import { verifyToken } from './middlewares/verifyToken.js'
import { logger } from './middlewares/logger.js'

dotenv.config()
const app = express()

app.use(express.json())
app.use(logger)
// Explain path prefixes. Esto les cuesta entender un poco.
app.use('/auth', authRouter)

// Explain all the routers after this point will use verifyToken. It's the chain of middleware operations.
app.use(verifyToken)
app.use('/customers', customersRouter)
app.use('/inventory', inventoryRouter)
app.use('/sales', salesRouter)

export default app
