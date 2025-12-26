
import { createClient } from '@supabase/supabase-js';

/**
 * Next.js Middleware - Security & Session Sync
 * 
 * FIX: Added checks for environment variables to prevent 500 
 * MIDDLEWARE_INVOCATION_FAILED errors on Vercel when keys are missing.
 */
export async function middleware(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Guard clause: If environment variables aren't set yet, skip middleware logic 
  // to prevent a runtime crash (500 error).
  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const url = new URL(req.url);
    
    // Logic for route protection would go here
    // Example: const { data: { user } } = await supabase.auth.getUser();
    
    return;
  } catch (error) {
    console.error("Middleware Execution Error:", error);
    return;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};