import createIntlMiddleware from "next-intl/middleware";

// Create the intl middleware only - testing basic routing first
export default createIntlMiddleware({
  locales: ['en', 'he'],
  defaultLocale: 'en',
  localePrefix: "always",
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
