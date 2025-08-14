// 메모 데이터 포매팅
export const formatMemoData = (
  memoData: any[],
  widgetMemoId: number | null,
) => {
  return memoData.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt,
    user: {
      id: m.writer.id,
      nickname: m.writer.nickname,
    },
    isWidgetMemo: widgetMemoId === m.id,
  }));
};

// 단일 메모 포매팅 (생성/수정 응답용)
export const formatSingleMemo = (memo: any, isWidgetMemo: boolean = false) => ({
  id: memo.id,
  content: memo.content,
  createdAt: memo.createdAt,
  user: { id: memo.writer.id, nickname: memo.writer.nickname },
  isWidgetMemo,
});
