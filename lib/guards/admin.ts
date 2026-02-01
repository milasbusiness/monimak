// Guards removed - no auth system
export async function requireCreator() {
  return { user: null, profile: null }
}

export async function requireAdmin() {
  return { user: null, profile: null }
}
