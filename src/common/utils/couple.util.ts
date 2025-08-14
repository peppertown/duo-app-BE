// 커플에서 파트너 ID 찾기
export const getPartnerId = (
  couple: { aId: number; bId: number },
  userId: number,
): number => {
  return couple.aId === userId ? couple.bId : couple.aId;
};
