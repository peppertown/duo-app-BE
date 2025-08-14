// API 응답 메시지 포매팅
export const formatApiResponse = (code: number, text: string, data?: any) => {
  const response: any = { message: { code, text } };
  if (data) {
    Object.assign(response, data);
  }
  return response;
};
