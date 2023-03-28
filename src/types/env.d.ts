declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_BASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}
