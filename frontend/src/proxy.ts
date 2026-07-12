import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/items/add', '/items/manage', '/seller/dashboard', '/admin/dashboard'];

const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  
  const path = request.nextUrl.pathname;


  const token = request.cookies.get('token')?.value;


  if (token && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && protectedRoutes.some(route => path.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: [

    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};