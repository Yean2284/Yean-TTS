
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oukwektkckchdopbikye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91a3dla3RrY2tjaGRvcGJpa3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDk3MDIsImV4cCI6MjA4NDAyNTcwMn0.Xd01Op4GRWdkpiQcWPI7Q-mLCqxFKzqK3EXFp6TXtDU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
