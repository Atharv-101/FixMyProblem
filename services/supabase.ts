import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION REQUIRED:
// 1. Go to https://supabase.com/dashboard/project/_/settings/api
// 2. Replace the values below with your specific "Project URL" and "anon" public key.
// ------------------------------------------------------------------

const supabaseUrl = 'https://onxnrngontcukddkglma.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueG5ybmdvbnRjdWtkZGtnbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTkzMjQsImV4cCI6MjA4MDI3NTMyNH0.yIrWltG-3afiUYhaQyoi1kapmeuA2SC5DWKm4bPPn7U';

export const supabase = createClient(supabaseUrl, supabaseKey);