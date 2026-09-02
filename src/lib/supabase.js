import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pvnnuzjxnruaysqeoucx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bm51emp4bnJ1YXlzcWVvdWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMTExODMsImV4cCI6MjEwMzc4NzE4M30.E3yIHBJszNV_q3m1gXDL_ZWCgdgZJYLJWVP_bAfa-fE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)