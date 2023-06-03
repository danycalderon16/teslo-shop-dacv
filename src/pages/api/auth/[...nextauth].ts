import { dbUsers } from "@/database";
import NextAuth, {NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface User {
      id?: string
      _id: string
  }
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name:'Custom Login',
      credentials: {
        email: {label:'Email',type:'email',placeholder:'email@email.com'},
        password: {label:'Password',type:'password',placeholder:'Password'},
      },
      async authorize(credentials){
        console.log(credentials);
        return await dbUsers.checkUserEmailPassword(credentials!.email,credentials!.password);
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // Custom Pages
  pages:{
    signIn:'/auth/login',
    newUser:'/auth/register',
  },

  // Callbacks
  session:{
    maxAge:2592000,// 30 días
    strategy:'jwt',
    updateAge:86400// cada día
  },

  callbacks:{
    async jwt({token, account, user}){
      if(account){
        token.accessToken = account.access_token;

        switch(account.type){
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email||'',user?.name||'');
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      
      return token;
    },
    async session({session, token, user}){  
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    }
  },
};

export default NextAuth(authOptions);