// List 데이터 포매팅
export const formatListData = (listData: any[], userId: number) => {
  return listData.map((i) => ({
    id: i.id,
    isOwn: i.writerId === userId,
    categoryId: i.categoryId,
    content: i.content,
    isDone: i.isDone,
    createdAt: i.createdAt,
  }));
};

// 버킷리스트 완료 알림 메시지 생성
export const createBucketListCompletionMessage = (
  categoryName: string,
  content: string,
): string => {
  return `완료된 버킷리스트가 있어요!\n${categoryName}: ${content}`;
};
