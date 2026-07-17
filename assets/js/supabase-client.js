/* ================================================================
   supabase-client.js — NexoSites
   Shared Supabase client instance, used on every page.
   Project: Nexo Sites (Supabase)
   ================================================================ */

const SUPABASE_URL = 'https://uimpfkisclriounbiaww.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbXBma2lzY2xyaW91bmJpYXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzIwNzQsImV4cCI6MjA5OTc0ODA3NH0.Ec1dstxn3O8xUuJ2c6SONI6Q_377alHfaAjgEzQVucU';

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
