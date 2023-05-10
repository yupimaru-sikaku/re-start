import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DB = {
  USER: 'users',
  STAFF: 'staffs',
  SCHEDULE: 'schedules',
  PROVIDER: 'providers',
  HOME_CARE: 'home_care',
  ACCOMPANY: 'accompany',
  BEHAVIOR: 'behavior',
  MOBILITY: 'mobility',
} as const;

export const getDb = (db: keyof typeof DB) => {
  return DB[db];
};
