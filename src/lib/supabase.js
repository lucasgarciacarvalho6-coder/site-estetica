import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pvnnuzjxnruaysqeoucx.supabase.co'

// Chave da Publishable API Key copiada do seu painel Supabase
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Az3352PyJg7GfB2BoPc_fw_E3BHK-xI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)