import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        const email = profile.email;
        const google_id = profile.google_id || 'normalUserLogin';
        const name = profile.name;
        const picture = profile.picture;

        const result = await pool.query(
          `INSERT INTO users (google_id, email, name, picture)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [google_id, email, name, picture]
        );

        token.userId = result.rows[0].id;
        token.email = email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
