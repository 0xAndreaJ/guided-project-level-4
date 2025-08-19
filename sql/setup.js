import mysql from 'mysql2/promise'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  const sql = fs.readFileSync(new URL('./schema.sql', import.meta.url))
  await conn.query(sql.toString())
  await conn.end()
}
run()
