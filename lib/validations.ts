import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  isCreator: z.boolean().default(false),
})

export const createPostSchema = z.object({
  type: z.enum(['image', 'video']),
  mediaUrl: z.string().url('Invalid media URL').max(2048),
  thumbnailUrl: z.string().url().max(2048).nullable().optional(),
  caption: z.string().min(1, 'Caption is required').max(2000).trim(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  visibility: z.enum(['public', 'subscribers']),
})

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000).trim(),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  bio: z.string().max(500).trim().optional(),
})

export const quickReplySchema = z.object({
  name: z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(2000).trim(),
})
