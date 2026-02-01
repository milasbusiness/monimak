import { query } from '@/lib/db'
import { HomeClient } from './home-client'

export default async function HomePage() {
  try {
    const result = await query(`
      SELECT p.*, 
             json_build_object(
               'id', c.id,
               'name', c.name,
               'username', c.username,
               'profile', json_build_object('id', pr.id, 'avatar_url', pr.avatar_url)
             ) as creators
      FROM posts p
      LEFT JOIN creators c ON p.creator_id = c.id
      LEFT JOIN profiles pr ON c.user_id = pr.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `)
    
    const posts = result.rows.map(row => ({
      ...row,
      creators: row.creators
    }))

    return <HomeClient posts={posts || []} isLoading={false} />
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <HomeClient posts={[]} isLoading={false} />
  }
}
