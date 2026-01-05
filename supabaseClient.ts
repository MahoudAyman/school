
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lgzcrfdnimkjlttejsjz.supabase.co'
const supabaseKey = 'sb_publishable_CtxuyZKnf-otUhsFO7r6VA_Z3K5ioHe'

export const supabase = createClient(supabaseUrl, supabaseKey)
