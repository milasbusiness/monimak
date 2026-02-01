import { query } from '@/lib/db'
import { DiscoverClient } from './discover-client'

export default async function DiscoverPage() {
  try {
    const creatorsResult = await query(`
      SELECT c.*,
             json_build_object('id', p.id, 'avatar_url', p.avatar_url) as profiles
      FROM creators c
      LEFT JOIN profiles p ON c.user_id = p.id
      ORDER BY c.subscriber_count DESC
    `)

    const creators = creatorsResult.rows.map(row => ({
      ...row,
      profiles: row.profiles
    }))

    return <DiscoverClient creators={creators || []} userSubscriptions={[]} />
  } catch (error) {
    console.error('Error fetching creators:', error)
    return <DiscoverClient creators={[]} userSubscriptions={[]} />
  }
}
