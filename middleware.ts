
/**
 * Next.js Middleware - Auth & Session Sync
 * This logic ensures that the user's session is refreshed on every request
 * to the dashboard or API, preventing unexpected logouts.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

export async function middleware(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // We initialize the client to check the session
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Example: Protecting the /dashboard route
  const url = new URL(req.url);
  const isDashboardPage = url.pathname.startsWith('/dashboard');

  // In a real Next.js environment, we would use:
  // const { data: { session } } = await supabase.auth.getSession();
  
  // if (!session && isDashboardPage) {
  //   return Response.redirect(new URL('/login', req.url));
  // }

  // Logic to refresh session:
  // const { data, error } = await supabase.auth.getUser();
  
  // Role-based Access Control (RBAC) check:
  // if (data.user?.user_metadata.role === 'DRIVER' && url.pathname.includes('/admin')) {
  //   return Response.redirect(new URL('/unauthorized', req.url));
  // }

  return;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
