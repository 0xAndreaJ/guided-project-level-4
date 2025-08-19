import { db } from "../models/db.js";
import { inventory } from "../models/schema.js";
import { eq, like, and, gte, lte, sql, desc, asc } from "drizzle-orm";

const sortable = {
  name: inventory.name,
  price: inventory.price,
  stock_quantity: inventory.stock_quantity,
  product_id: inventory.product_id,
};

export async function createProduct(req, res) {
  try {
    const result = await db.insert(inventory).values(req.body);
    const id = result.insertId;
    const rows = await db.select().from(inventory).where(eq(inventory.product_id, id));
    res.status(201).json(rows[0] || null);
  } catch {
    res.status(400).json({ error: "Unable to create" });
  }
}

export async function listProducts(req, res) {
  try {
    const rows = await db.select().from(inventory);
    res.json({ data: rows });
  } catch {
    res.status(400).json({ error: "Unable to list" });
  }
}

export async function getProductById(req, res) {
  const id = parseInt(req.params.product_id);
  const rows = await db.select().from(inventory).where(eq(inventory.product_id, id));
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
}

export async function updateProduct(req, res) {
  try {
    const id = parseInt(req.params.product_id);
    await db.update(inventory).set(req.body).where(eq(inventory.product_id, id));
    const rows = await db.select().from(inventory).where(eq(inventory.product_id, id));
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch {
    res.status(400).json({ error: "Unable to update" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = parseInt(req.params.product_id);
    await db.delete(inventory).where(eq(inventory.product_id, id));
    res.json({ deleted: true });
  } catch {
    res.status(400).json({ error: "Unable to delete" });
  }
}

export async function adjustStock(req, res) {
  try {
    const id = parseInt(req.params.product_id);
    const rows = await db.select().from(inventory).where(eq(inventory.product_id, id));
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    const current = rows[0].stock_quantity;
    const next = current + req.body.change;
    if (next < 0) return res.status(400).json({ error: "Insufficient stock" });
    await db.update(inventory).set({ stock_quantity: next }).where(eq(inventory.product_id, id));
    const updated = await db.select().from(inventory).where(eq(inventory.product_id, id));
    res.json(updated[0]);
  } catch {
    res.status(400).json({ error: "Unable to adjust" });
  }
}
