import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://afqfsleyogtjvxfurqyn.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcWZzbGV5b2d0anZ4ZnVycXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzQyNjMsImV4cCI6MjA5NDc1MDI2M30.93Ul_Noe7zWCahK01X8_eyNFYWaEZ0J15VE0lZkXgII'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// Nombre del bucket para fotos de piezas
export const BUCKET = 'parts-images'
