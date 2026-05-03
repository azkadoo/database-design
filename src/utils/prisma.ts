import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { url } from "inspector";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });

export const prisma = new PrismaClient({ adapter });
