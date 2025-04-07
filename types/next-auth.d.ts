import NextAuth from "next-auth";
import { Rol } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: number;
    nombre: string;
    rol: Rol;
  }

  interface Session {
    user: {
      id: number;
      email: string;
      nombre: string;
      rol: Rol;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    nombre: string;
    rol: Rol;
  }
} 