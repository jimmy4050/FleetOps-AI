
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * Next.js Middleware - Security & Session Sync
 */
export async function middleware(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const url = new URL(req.url);
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/register');
  const isDashboardRoute = url.pathname.startsWith('/dashboard') || 
                           url.pathname.startsWith('/fleet') || 
                           url.pathname.startsWith('/ai');

  // In a real environment, we check the session via cookies here
  // const { data: { user } } = await supabase.auth.getUser();

  // Redirect Logic Examples:
  // if (!user && isDashboardRoute) return Response.redirect(new URL('/login', req.url));
  // if (user && isAuthRoute) return Response.redirect(new URL('/dashboard', req.url));

  return;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
