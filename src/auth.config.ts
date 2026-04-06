import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    providers: [], // Empty for now, added in auth.ts
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublic =
                nextUrl.pathname.startsWith('/login') ||
                nextUrl.pathname.startsWith('/register') ||
                nextUrl.pathname.startsWith('/api/auth') ||
                nextUrl.pathname.startsWith('/api/register');

            if (isPublic) return true;
            return isLoggedIn;
        },
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
} satisfies NextAuthConfig;
