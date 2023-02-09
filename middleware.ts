import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // you can access the user's token here and check for custom permissions or roles
      return !!token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = { matcher: ['/dashboard', '/admin/:path*'] };
