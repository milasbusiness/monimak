import { Pool } from 'pg'

let pool: Pool | null = null

export function getDb() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required')
    }
    
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }
  
  return pool
}

export async function query(text: string, params?: any[]) {
  const db = getDb()
  return db.query(text, params)
}
