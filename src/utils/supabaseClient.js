import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sthmpbjfggiitpighefx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NNWSGAilU6Dkq4zr-gxijA_K6J3NCtn';

export const supabase = createClient(supabaseUrl, supabaseKey);
