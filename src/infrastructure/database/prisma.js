import { PrismaClient } from "@prisma/client";
import "../../shared/env.js";

export const prisma = new PrismaClient();
