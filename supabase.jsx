import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://knmtysvrkafikxgttmns.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubXR5c3Zya2FmaWt4Z3R0bW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTI0OTIsImV4cCI6MjA0OTk4ODQ5Mn0.kZM8jx8k-uSprMQsbVIrIX57cqZMCI_X3PHuqPhelBY'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
