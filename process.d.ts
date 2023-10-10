declare namespace NodeJS {
  export interface ProcessEnv {
    VERCEL_GIT_COMMIT_SHA: string;
    NEXT_PUBLIC_SUBSCRIBER_ID: string;
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY: string;
    NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID: string;
    NEXT_PUBLIC_KNOCK_SECRET_API_KEY: string;
  }
}
