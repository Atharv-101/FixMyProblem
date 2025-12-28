import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION REQUIRED:
// 1. Go to https://supabase.com/dashboard/project/_/settings/api
// 2. Replace the values below with your specific "Project URL" and "anon" public key.
// ------------------------------------------------------------------

const supabaseUrl = 'https://qwqtqyupqepfkwoyxcag.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cXRxeXVwcWVwZmt3b3l4Y2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDgwMDUsImV4cCI6MjA4MjUyNDAwNX0.dc27N-PNL5pOfIXHuDu-3LsxVnbYTJegT0y5i6cpIdo';

export const supabase = createClient(supabaseUrl, supabaseKey);