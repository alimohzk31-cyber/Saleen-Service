import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment Variables:', { supabaseUrl, supabaseKey });

let supabaseClient = null;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

if (supabaseUrl && supabaseKey && supabaseUrl !== 'undefined' && supabaseKey !== 'undefined' && isValidUrl(supabaseUrl)) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase URL or Key is missing or invalid. Please check your environment variables.');
}

export const supabase = supabaseClient;
