import { PrismaClient } from "../prisma/generated-client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient | undefined;
}

// In Prisma 7, you MUST pass the adapter in the options object
export const db = 
  globalThis.prisma || 
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;