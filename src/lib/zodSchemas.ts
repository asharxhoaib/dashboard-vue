import { z } from 'zod'

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be under 60 characters'),
  email: z.string().email('Enter a valid email address'),
  bio: z.string().max(280, 'Bio must be under 280 characters').optional().default(''),
  company: z.string().max(80, 'Company must be under 80 characters').optional().default(''),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const notificationPrefsSchema = z.object({
  emailAlerts: z.boolean(),
  pushAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
  liveFeedAlerts: z.boolean(),
})

export function safeParseProfile(input: unknown) {
  return profileSchema.safeParse(input)
}
