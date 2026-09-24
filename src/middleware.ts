import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Non-sensitive flag cookies set by the auth store when a session is
  // gained/lost. The real access token stays in the Zustand store/memory.
  const isAuthed = req.cookies.get("nema_auth")?.value === "1";
  const role = req.cookies.get("nema_role")?.value;

  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  const isProtectedAccountRoute =
    pathWithoutLocale.startsWith("/account") ||
    pathWithoutLocale.startsWith("/checkout") ||
    /^\/(profile|orders|addresses|wishlist)(\/|$)/.test(pathWithoutLocale);
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");

  if (isAdminRoute && (!isAuthed || role !== "admin")) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedAccountRoute && !isAuthed) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
