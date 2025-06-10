import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Korumalı rotaları yönet
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin sayfalarını koru
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Profil ve randevu sayfalarını koru
    if ((path.startsWith("/profile") || path.startsWith("/appointments") || path.startsWith("/book-appointment")) && !token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

// Korunacak rotaları belirle
export const config = {
  matcher: ["/admin/:path*", "/profile", "/appointments", "/book-appointment"]
} 