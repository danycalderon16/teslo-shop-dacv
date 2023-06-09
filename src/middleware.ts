import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const requestedPage = req.nextUrl.pathname;
  const validRoles = ['admin', 'super-user', 'SEO'];
  console.log(requestedPage);
  
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedPage}`;

    if (requestedPage.startsWith('/api')) {
      return new Response(JSON.stringify({ message: 'No autorization' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return NextResponse.redirect(url);
    }

  if (requestedPage.startsWith('/api/admin') && !validRoles.includes(session.user.role)) {
    return new Response(JSON.stringify({ message: 'No autorization' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (requestedPage.startsWith('/admin') && !validRoles.includes(session.user.role)) {
    console.log(session.user.role);
    
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders/:path*',
    '/admin/:path*',
    '/api/orders/:path*',
    '/api/admin/:path*'
  ],
};