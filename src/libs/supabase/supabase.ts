import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DB = {
  USER: 'users',
  STAFF: 'staffs',
  STAFF_SCHEDULE: 'staff_schedules',
  PROVIDER: 'providers',
  HOME_CARE: 'home_care_records',
  ACCOMPANY: 'accompany_records',
  BEHAVIOR: 'behavior_records',
  MOBILITY: 'mobility_records',
} as const;

export const getDb = (db: keyof typeof DB) => {
  return DB[db];
};
