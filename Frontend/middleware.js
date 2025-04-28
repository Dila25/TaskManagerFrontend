// /middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/Pages/login' || path === '/Pages/register' || path === '/'
  
  const token = request.cookies.get('Token')?.value || ''
  
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/Pages/allTask', request.nextUrl))
  }
  
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/Pages/login', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/Pages/login',
    '/Pages/register',
    '/Pages/addTask',
    '/Pages/allTask',
    '/Pages/profile',
    '/Pages/updateAccount',
    '/Pages/updateTask',

  ]
}