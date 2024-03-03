declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string
    DISTRIBUTION_ENV: string
    POSTGRES_PRISMA_URL: string
    POSTGRES_URL_NON_POOLING: string
    KV_HOST: string
    KV_PORT: string
    KV_USERNAME: string
    KV_PASSWORD: string
    JWT_SECRET: string
    SESSION_SECRET: string
    ENCRYPT_KEY: string
    ENCRYPT_IV: string
    REQUEST_SIGN_KEY: string
    SMTP_SERVER_HOST: string
    SMTP_SERVER_USER: string
    SMTP_SERVER_PASS: string
    SMTP_SERVER_FROM: string
    ASSETS_HOST: string
    ASSETS_REGION: string
    ASSETS_ENDPOINT: string
    ASSETS_BUCKET: string
    ASSETS_ACCESS_KEY_ID: string
    ASSETS_ACCESS_KEY_SECRET: string
    RENDER_GIT_BRANCH: string
    RENDER_GIT_COMMIT: string
    RENDER_GIT_REPO_SLUG: string
  }
}
