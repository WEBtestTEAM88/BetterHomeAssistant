import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/devices/:path*",
    "/api/rooms/:path*",
    "/api/scenes/:path*",
    "/auth/register",
  ],
}; 