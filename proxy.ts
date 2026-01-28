import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Tentukan rute publik
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/blog(.*)',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Cek apakah rute saat ini memerlukan login
  if (!isPublicRoute(request)) {
    // 3. Await auth() untuk mendapatkan objek auth, lalu panggil protect()
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals dan file statis
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Selalu jalankan untuk API routes
    '/(api|trpc)(.*)',
  ],
};