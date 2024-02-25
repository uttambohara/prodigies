import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/uploadthing"],

  afterAuth(auth, req) {
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const pathWithSearchParams = `${url.pathname}/${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    const subDomain = req.headers
      .get("host")
      ?.split(".")
      .filter((item) => item !== process.env.NEXT_DOMAIN_URL)[0];
    if (subDomain) {
      return NextResponse.rewrite(
        new URL(`/${subDomain}${pathWithSearchParams}`, req.url)
      );
    }

    if (url.pathname === "/" || url.pathname === "/site") {
      return NextResponse.rewrite(new URL(`/site`, req.url));
    }
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }
    if (url.pathname === "/agency" || url.pathname === "/subaccount") {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
