import { DefaultSession} from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}