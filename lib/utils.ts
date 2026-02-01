import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function clampText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

/**
 * Extracts Supabase URL and anon key from environment variables.
 * Uses DATABASE_URL to derive the Supabase project URL if NEXT_PUBLIC_SUPABASE_URL is not set.
 * 
 * During static generation, if NEXT_PUBLIC_SUPABASE_ANON_KEY is not available,
 * this will throw an error. Make sure to set it in .env.local for builds.
 */
export function getSupabaseConfig() {
  // Try to get from explicit env vars first
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && anonKey) {
    return { url, anonKey }
  }

  // Extract from DATABASE_URL if available
  const databaseUrl = process.env.DATABASE_URL
  if (databaseUrl) {
    // Extract project ID from DATABASE_URL
    // Format: postgresql://postgres.PROJECT_ID:password@host:port/database
    const match = databaseUrl.match(/postgres\.([^.]+)\./)
    if (match) {
      const projectId = match[1]
      const extractedUrl = `https://${projectId}.supabase.co`
      
      // Check for anon key again (might be loaded from .env.local now)
      // Next.js loads .env.local automatically during build and runtime
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (key) {
        return { url: extractedUrl, anonKey: key }
      }
      
      // During build, .env.local should be available
      // If not, provide helpful error message
      if (typeof window === 'undefined') {
        // Server-side: check if we're in a build context
        const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL && !process.env.NETLIFY
        if (isBuildTime) {
          throw new Error(
            'NEXT_PUBLIC_SUPABASE_ANON_KEY is required during build. ' +
            'Please ensure .env.local exists with NEXT_PUBLIC_SUPABASE_ANON_KEY set. ' +
            'Get it from: https://supabase.com/dashboard/project/_/settings/api'
          )
        }
      }
      
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY is required. ' +
        'Please set it in your .env.local file. ' +
        'Get it from: https://supabase.com/dashboard/project/_/settings/api'
      )
    }
  }

  throw new Error(
    'Supabase configuration is missing. ' +
    'Either set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, ' +
    'or set DATABASE_URL (and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local).'
  )
}
