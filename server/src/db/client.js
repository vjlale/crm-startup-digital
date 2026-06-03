import { PrismaClient } from '@prisma/client'

// Cliente Prisma único compartido en toda la app.
export const prisma = new PrismaClient()
