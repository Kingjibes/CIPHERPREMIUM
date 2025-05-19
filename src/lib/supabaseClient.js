
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxvkpxhvxafsoiqiozvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dmtweGh2eGFmc29pcWlvenZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDYyNTksImV4cCI6MjA2MzIyMjI1OX0.3NReA5q7j6HpNPfLxGdrD5K1R5kryf8fOZfie-4IZm0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
