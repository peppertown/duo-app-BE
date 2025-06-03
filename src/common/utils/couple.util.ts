import { PrismaClient } from '@prisma/client';

const primsa = new PrismaClient();

export const getCoupleUsersIds = async (coupleId: number) => {
  const couple = await primsa.couple.findUnique({
    where: { id: coupleId },
    select: {
      a: { select: { id: true, nickname: true } },
      b: { select: { id: true, nickname: true } },
    },
  });

  return { a: couple.a, b: couple.b };
};
