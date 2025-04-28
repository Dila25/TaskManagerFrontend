import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export function withAuth(gssp) {
  return async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      };
    }
    context.session = session;
    return await gssp(context);
  };
}
