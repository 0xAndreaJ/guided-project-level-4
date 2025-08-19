import { mysqlTable, int, varchar, decimal, datetime } from 'drizzle-orm/mysql-core'

// New topic

export const customers = mysqlTable('customers', {
  customer_id: int('customer_id').autoincrement().primaryKey(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull()
})

export const inventory = mysqlTable('inventory', {
  product_id: int('product_id').autoincrement().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock_quantity: int('stock_quantity').notNull()
})

export const sales = mysqlTable('sales', {
  sale_id: int('sale_id').autoincrement().primaryKey(),
  customer_id: int('customer_id').notNull(),
  product_id: int('product_id').notNull(),
  sale_date: datetime('sale_date', { fsp: 0 }).notNull(),
  quantity: int('quantity').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull()
})
