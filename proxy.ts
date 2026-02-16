import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define your routes
const isPublicRoute = createRouteMatcher(['/','/reset-password(.*)', '/signin(.*)', '/signup(.*)', '/callback(.*)']);
const isProtectedRoute = createRouteMatcher(['/api(.*)', '/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Extract userId by awaiting auth()
  const { userId } = await auth();

  // If logged in & trying to visit Landing/Signin -> Bounce to Dashboard
  // if (userId && isPublicRoute(req)) {
  //   return NextResponse.redirect(new URL('/dashboard/user', req.url));
  // }

  // Protect private routes
  if (!userId && isProtectedRoute(req)) {
    //Use the specific redirect provided by clerkMiddleware's auth object
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};