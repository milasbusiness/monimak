import { query } from '@/lib/db'
import { LibraryClient } from './library-client'

export default async function LibraryPage() {
  try {
    const subscriptionsResult = await query(`
      SELECT c.*,
             json_build_object('id', p.id, 'avatar_url', p.avatar_url) as profiles
      FROM subscriptions s
      JOIN creators c ON s.creator_id = c.id
      LEFT JOIN profiles p ON c.user_id = p.id
    `)

    const savedPostsResult = await query(`
      SELECT po.*,
             json_build_object(
               'id', c.id,
               'name', c.name,
               'username', c.username,
               'profile', json_build_object('id', pr.id, 'avatar_url', pr.avatar_url)
             ) as creators
      FROM saved_posts sp
      JOIN posts po ON sp.post_id = po.id
      LEFT JOIN creators c ON po.creator_id = c.id
      LEFT JOIN profiles pr ON c.user_id = pr.id
      ORDER BY sp.created_at DESC
    `)

    const subscriptions = subscriptionsResult.rows.map(row => ({
      ...row,
      profiles: row.profiles
    }))

    const savedPosts = savedPostsResult.rows.map(row => ({
      ...row,
      creators: row.creators
    }))

    return (
      <LibraryClient
        subscriptions={subscriptions}
        savedPosts={savedPosts}
      />
    )
  } catch (error) {
    console.error('Error fetching library data:', error)
    return <LibraryClient subscriptions={[]} savedPosts={[]} />
  }
}
