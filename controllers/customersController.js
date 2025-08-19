import { db } from '../models/db.js'
import { customers, sales, inventory } from '../models/schema.js'
import { eq, like, and, or, sql, desc, asc } from 'drizzle-orm'

const sortable = {
  first_name: customers.first_name,
  last_name: customers.last_name,
  email: customers.email,
  customer_id: customers.customer_id
}

export async function createCustomer(req, res) {
  try {
    const result = await db.insert(customers).values(req.body)
    const id = result.insertId
    const rows = await db.select().from(customers).where(eq(customers.customer_id, id))
    res.status(201).json(rows[0] || null)
  } catch (e) {
    res.status(400).json({ error: 'Unable to create' })
  }
}

export async function listCustomers(req, res) {
  try {
    const rows = await db.select().from(customers);
    res.json({ data: rows})
  } catch {
    res.status(400).json({ error: 'Unable to list' })
  }
}

export async function getCustomerById(req, res) {
  const id = parseInt(req.params.customer_id)
  const rows = await db.select().from(customers).where(eq(customers.customer_id, id))
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}

export async function updateCustomer(req, res) {
  try {
    const id = parseInt(req.params.customer_id)
    await db.update(customers).set(req.body).where(eq(customers.customer_id, id))
    const rows = await db.select().from(customers).where(eq(customers.customer_id, id))
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch {
    res.status(400).json({ error: 'Unable to update' })
  }
}

export async function deleteCustomer(req, res) {
  try {
    const id = parseInt(req.params.customer_id)
    await db.delete(customers).where(eq(customers.customer_id, id))
    res.json({ deleted: true })
  } catch {
    res.status(400).json({ error: 'Unable to delete' })
  }
}

export async function listCustomerSales(req, res) {
  try {
    const id = parseInt(req.params.customer_id)
    const rows = await db.select().from(sales).where(eq(sales.customer_id, id))
    if (!rows) return res.json([])
    const result = await db.select({
      sale_id: sales.sale_id,
      sale_date: sales.sale_date,
      quantity: sales.quantity,
      total_price: sales.total_price,
      product_id: sales.product_id
    }).from(sales).where(eq(sales.customer_id, id))
    res.json(result)
  } catch {
    res.status(400).json({ error: 'Unable to list' })
  }
}
