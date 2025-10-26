/**
 * Centralized application configuration
 */
export const config = {
  api: {
    baseURL:
      import.meta.env.VITE_API_BASE_URL || "https://backend.spacetechs.net/api",
    apiKey: import.meta.env.VITE_API_KEY || "my-super-secret-key-2025",
    timeout: 10000,
  },
  app: {
    name: "SpaceTechs React",
    version: "2.0.2",
  },
  storage: {
    tokenKey: "token",
    userKey: "user",
  },
} as const;
