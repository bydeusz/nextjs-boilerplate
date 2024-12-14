import { authMiddleware } from "@clerk/nextjs";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

const locales = ["en", "nl"];
const defaultLocale = "nl";
const cookieName = "i18nlang";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: any) {
  if (request.cookies.has(cookieName))
    return request.cookies.get(cookieName).value;
  const acceptLang = request.headers.get("Accept-Language");
  if (!acceptLang) return defaultLocale;
  const headers = { "accept-language": acceptLang };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

// Base public routes without locale
const basePublicRoutes = ["/sign-in", "/sign-up", "/reset-password"];
const publicRoutes = basePublicRoutes.flatMap((route) =>
  locales.map((locale) => `/${locale}${route}`),
);
publicRoutes.push(...basePublicRoutes);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default async function middleware(request: any, event: any) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    const authResponse = await authMiddleware({
      publicRoutes,
      ignoredRoutes: ["/api/auth/validate-email"],
    })(request, event);
    if (authResponse) return authResponse;
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newPathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(new URL(newPathname, request.url));
    response.cookies.set(cookieName, locale);
    return response;
  }

  const authResponse = await authMiddleware({
    publicRoutes,
    ignoredRoutes: ["/api/auth/validate-email"],
  })(request, event);
  if (authResponse) return authResponse;

  return NextResponse.next();
}
