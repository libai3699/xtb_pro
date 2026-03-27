import { Prisma } from '@prisma/client';

export function isMissingTableError(error: unknown, table?: string) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  if (error.code !== 'P2021') {
    return false;
  }

  if (!table) {
    return true;
  }

  return error.meta?.table === table;
}
