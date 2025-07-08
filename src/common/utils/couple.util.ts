import { PrismaClient } from '@prisma/client';

const primsa = new PrismaClient();

export const getCoupleUsersData = async (coupleId: number) => {
  const couple = await primsa.couple.findUnique({
    where: { id: coupleId },
    select: {
      a: true,
      b: true,
    },
  });

  return { a: couple.a, b: couple.b };
};

export const getPartnerData = async (userId: number, coupleId: number) => {
  if (!coupleId) return null;
  const couple = await getCoupleUsersData(coupleId);

  let partner = null;

  for (const user in couple) {
    if (couple[user].id !== userId) {
      const { id, nickname, profileUrl, code, birthday } = couple[user];
      partner = { id, nickname, profileUrl, code, birthday };
    }
  }

  return partner;
};
