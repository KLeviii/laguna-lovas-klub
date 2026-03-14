import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
  if (!_supabase) {
    const config = useRuntimeConfig()
    _supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  }
  return _supabase
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabase()[prop]
  }
})
