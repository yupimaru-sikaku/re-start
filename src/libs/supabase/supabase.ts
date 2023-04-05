import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DB = {
  USER: 'users',
  PROVIDER: 'providers',
  HOME_CARE_RECORD: 'home_care_records',
  ACCOMPANYING: 'accompanying_records',
  BEHAVIOR: 'behavior_records',
  MOBILITY: 'mobility_records',
} as const;

export const getDb = (db: keyof typeof DB) => {
  return DB[db];
};
