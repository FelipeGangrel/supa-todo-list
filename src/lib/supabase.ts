import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export { supabase }
