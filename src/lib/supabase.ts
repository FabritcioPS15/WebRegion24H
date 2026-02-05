import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffmtnkfwalqxxboewuvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbXRua2Z3YWxxeHhib2V3dXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDk5MzMsImV4cCI6MjA4NTgyNTkzM30.qRpKO9OCY6I_7cLFdn23xrZWpQF4BVxqG2V2jlU1OQU';

export const supabase = createClient(supabaseUrl, supabaseKey);
