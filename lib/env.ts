import { z } from "zod"

const ServerEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1).optional(),

  HYSTERIA_BIN: z.string().min(1).optional(),
  HYSTERIA_WORK_DIR: z.string().min(1).optional(),
  HYSTERIA_DOWNLOAD_BASE_URL: z
    .string()
    .url()
    .default("https://github.com/apernet/hysteria/releases/download"),

  HYSTERIA_AUTH_BACKEND_SECRET: z.string().min(16).optional(),
  HYSTERIA_TRAFFIC_API_BASE_URL: z
    .string()
    .url()
    .default("http://127.0.0.1:25000"),
  HYSTERIA_TRAFFIC_API_SECRET: z.string().min(1).optional(),

  NODE_ID: z.string().min(1).default("default"),

  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1).optional(),

  SESSION_COOKIE_NAME: z.string().min(1).default("__session"),
  SESSION_COOKIE_MAX_AGE_SECONDS: z.coerce
    .number()
    .int()
    .min(60)
    .max(60 * 60 * 24 * 14)
    .default(60 * 60 * 24 * 5),
})

export type ServerEnv = z.infer<typeof ServerEnvSchema>

let cached: ServerEnv | null = null

export function serverEnv(): ServerEnv {
  if (cached) return cached
  const parsed = ServerEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    )
  }
  cached = parsed.data
  return cached
}
