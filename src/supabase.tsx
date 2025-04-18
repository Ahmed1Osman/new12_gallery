import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://legqetvavaujoqvmpztp.supabase.co";
// Replace with your actual anon key from Supabase dashboard (Settings > API)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ3FldHZhdmF1am9xdm1wenRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjUyNzAsImV4cCI6MjA1ODgwMTI3MH0.X_vuFrzcLqWErKSyKNZm9aZXuzRvrkV40X3-1S4jDfE"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);