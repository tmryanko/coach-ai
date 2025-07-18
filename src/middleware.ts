import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";
import { type NextRequest } from "next/server";

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export async function middleware(request: NextRequest) {
  try {
    // First run the intl middleware for locale detection
    const intlResponse = intlMiddleware(request);
    
    // If intl middleware returns a response (redirect), use it
    if (intlResponse) {
      return intlResponse;
    }

    // Otherwise, continue with the Supabase auth middleware
    return await updateSession(request);
  } catch (error) {
    console.error("Middleware error:", error);
    throw error;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
