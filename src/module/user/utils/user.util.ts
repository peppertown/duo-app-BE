// 사용자 데이터 포매팅
export const formatUserData = (user: any, coupleId?: number) => {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    profileUrl: user.profileUrl,
    code: user.code,
    ...(coupleId && { coupleId }),
  };
};

// 파트너 데이터 포매팅
export const formatPartnerData = (partner: any) => {
  return {
    id: partner.id,
    nickname: partner.nickname,
    profileUrl: partner.profileUrl,
    code: partner.code,
  };
};

// 커플 데이터 포매팅
export const formatCoupleData = (couple: any) => {
  return {
    anniversary: couple.anniversary,
  };
};

// 매칭 응답 데이터 포매팅
export const formatMatchUserData = (user: any, partner: any, couple: any) => {
  return {
    user: formatUserData(user, couple.id),
    partner: formatPartnerData(partner),
    couple: formatCoupleData(couple),
  };
};
