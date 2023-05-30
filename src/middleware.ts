import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req:NextRequest, ev:NextFetchEvent){
  
  const previousPage = req.nextUrl.pathname; 
  if (previousPage.startsWith('/checkout')) {   
    const token = req.cookies.get('token')?.value || '';
    
    try {
      const response = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_SEED)
      );      
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL(`/auth/login?p=${previousPage}`,req.url));
    }

  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/checkout/:path*'
  ],
};