// This file contains type information for NextAuth as comments
// Kept for reference in case we want to switch back to TypeScript in the future

/*
Type definitions that were in next-auth.d.ts:

declare module "next-auth" {
  interface User {
    id: string
    role: string
  }

  interface Session {
    user: User & {
      id: string
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
*/

// No actual code needed here - this is just for documentation
export {} 