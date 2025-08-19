import { db } from '../models/db.js'
import { sales, inventory } from '../models/schema.js'
import { eq, sql } from 'drizzle-orm'

export async function createSale(req, res) {
  try {
    const body = req.body
    const productRows = await db.select().from(inventory).where(eq(inventory.product_id, body.product_id))
    const product = productRows[0]
    if (!product) return res.status(400).json({ error: 'Product not found' })
    if (product.stock_quantity < body.quantity) return res.status(400).json({ error: 'Insufficient stock' })
    const total = Number(product.price) * body.quantity
    let created
    await db.transaction(async (tx) => {
      const insert = await tx.insert(sales).values({
        customer_id: body.customer_id,
        product_id: body.product_id,
        sale_date: new Date(body.sale_date),
        quantity: body.quantity,
        total_price: total.toFixed(2)
      })
      const id = insert.insertId
      const nextStock = product.stock_quantity - body.quantity
      await tx.update(inventory).set({ stock_quantity: nextStock }).where(eq(inventory.product_id, body.product_id))
      const rows = await tx.select().from(sales).where(eq(sales.sale_id, id))
      created = rows[0]
    })
    res.status(201).json(created)
  } catch {
    res.status(400).json({ error: 'Unable to create' })
  }
}

export async function listSales(req, res) {
  try {
    const rows = await db.select().from(sales);
    res.json({ data: rows})
  } catch {
    res.status(400).json({ error: 'Unable to list' })
  }
}




export async function replaceSale(req, res) {
  try {
    const id = parseInt(req.params.sale_id)
    const existingRows = await db.select().from(sales).where(eq(sales.sale_id, id))
    const existing = existingRows[0]
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const productRows = await db.select().from(inventory).where(eq(inventory.product_id, req.body.product_id))
    const product = productRows[0]
    if (!product) return res.status(400).json({ error: 'Product not found' })
    const diff = req.body.quantity - existing.quantity
    if (diff > 0 && product.stock_quantity < diff) return res.status(400).json({ error: 'Insufficient stock' })
    const total = Number(product.price) * req.body.quantity
    let updated
    await db.transaction(async (tx) => {
      await tx.update(sales).set({
        customer_id: req.body.customer_id,
        product_id: req.body.product_id,
        sale_date: new Date(req.body.sale_date),
        quantity: req.body.quantity,
        total_price: total.toFixed(2)
      }).where(eq(sales.sale_id, id))
      const nextStock = product.stock_quantity - diff
      await tx.update(inventory).set({ stock_quantity: nextStock }).where(eq(inventory.product_id, req.body.product_id))
      const rows = await tx.select().from(sales).where(eq(sales.sale_id, id))
      updated = rows[0]
    })
    res.json(updated)
  } catch {
    res.status(400).json({ error: 'Unable to update' })
  }
}

export async function patchSale(req, res) {
  try {
    const id = parseInt(req.params.sale_id)
    const existingRows = await db.select().from(sales).where(eq(sales.sale_id, id))
    const existing = existingRows[0]
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const next = { ...existing, ...req.body }
    const productRows = await db.select().from(inventory).where(eq(inventory.product_id, next.product_id))
    const product = productRows[0]
    if (!product) return res.status(400).json({ error: 'Product not found' })
    const diff = (next.quantity ?? existing.quantity) - existing.quantity
    if (diff > 0 && product.stock_quantity < diff) return res.status(400).json({ error: 'Insufficient stock' })
    const total = Number(product.price) * (next.quantity ?? existing.quantity)
    let updated
    await db.transaction(async (tx) => {
      await tx.update(sales).set({
        customer_id: next.customer_id,
        product_id: next.product_id,
        sale_date: next.sale_date ? new Date(next.sale_date) : existing.sale_date,
        quantity: next.quantity ?? existing.quantity,
        total_price: total.toFixed(2)
      }).where(eq(sales.sale_id, id))
      const nextStock = product.stock_quantity - diff
      await tx.update(inventory).set({ stock_quantity: nextStock }).where(eq(inventory.product_id, next.product_id))
      const rows = await tx.select().from(sales).where(eq(sales.sale_id, id))
      updated = rows[0]
    })
    res.json(updated)
  } catch {
    res.status(400).json({ error: 'Unable to update' })
  }
}

export async function deleteSale(req, res) {
  try {
    const id = parseInt(req.params.sale_id)
    const existingRows = await db.select().from(sales).where(eq(sales.sale_id, id))
    const existing = existingRows[0]
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const productRows = await db.select().from(inventory).where(eq(inventory.product_id, existing.product_id))
    const product = productRows[0]
    await db.transaction(async (tx) => {
      await tx.delete(sales).where(eq(sales.sale_id, id))
      const nextStock = product.stock_quantity + existing.quantity
      await tx.update(inventory).set({ stock_quantity: nextStock }).where(eq(inventory.product_id, existing.product_id))
    })
    res.json({ deleted: true })
  } catch {
    res.status(400).json({ error: 'Unable to delete' })
  }
}

export async function salesSummary(req, res) {
  try {
    // explain SUM and GROUP BY
    const byProduct = await db.execute(sql`select product_id, sum(quantity) as units, sum(total_price) as revenue from sales group by product_id`)
    const byDay = await db.execute(sql`select date(sale_date) as date, sum(quantity) as units, sum(total_price) as revenue from sales group by date(sale_date)`)
    res.json({ byProduct: byProduct[0], byDay: byDay[0] })
  } catch {
    res.status(400).json({ error: 'Unable to summarize' })
  }
}
