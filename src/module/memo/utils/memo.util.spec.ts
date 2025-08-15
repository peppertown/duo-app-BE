import { formatMemoData, formatSingleMemo } from './memo.util';

describe('Memo Utils', () => {
  describe('formatMemoData', () => {
    it('should format memo data correctly with widget memo', () => {
      const mockMemoData = [
        {
          id: 1,
          content: '첫 번째 메모',
          createdAt: new Date('2024-01-01'),
          writer: { id: 10, nickname: '사용자A' },
        },
        {
          id: 2,
          content: '두 번째 메모',
          createdAt: new Date('2024-01-02'),
          writer: { id: 20, nickname: '사용자B' },
        },
      ];
      const widgetMemoId = 1;

      const result = formatMemoData(mockMemoData, widgetMemoId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        content: '첫 번째 메모',
        createdAt: new Date('2024-01-01'),
        user: { id: 10, nickname: '사용자A' },
        isWidgetMemo: true,
      });
      expect(result[1]).toEqual({
        id: 2,
        content: '두 번째 메모',
        createdAt: new Date('2024-01-02'),
        user: { id: 20, nickname: '사용자B' },
        isWidgetMemo: false,
      });
    });

    it('should format memo data correctly without widget memo', () => {
      const mockMemoData = [
        {
          id: 1,
          content: '메모 내용',
          createdAt: new Date('2024-01-01'),
          writer: { id: 10, nickname: '테스트유저' },
        },
      ];
      const widgetMemoId = null;

      const result = formatMemoData(mockMemoData, widgetMemoId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        content: '메모 내용',
        createdAt: new Date('2024-01-01'),
        user: { id: 10, nickname: '테스트유저' },
        isWidgetMemo: false,
      });
    });

    it('should handle empty memo data', () => {
      const mockMemoData = [];
      const widgetMemoId = 1;

      const result = formatMemoData(mockMemoData, widgetMemoId);

      expect(result).toEqual([]);
    });
  });

  describe('formatSingleMemo', () => {
    it('should format single memo correctly when it is widget memo', () => {
      const mockMemo = {
        id: 1,
        content: '위젯 메모',
        createdAt: new Date('2024-01-01'),
        writer: { id: 10, nickname: '작성자' },
      };

      const result = formatSingleMemo(mockMemo, true);

      expect(result).toEqual({
        id: 1,
        content: '위젯 메모',
        createdAt: new Date('2024-01-01'),
        user: { id: 10, nickname: '작성자' },
        isWidgetMemo: true,
      });
    });

    it('should format single memo correctly when it is not widget memo', () => {
      const mockMemo = {
        id: 2,
        content: '일반 메모',
        createdAt: new Date('2024-01-02'),
        writer: { id: 20, nickname: '사용자' },
      };

      const result = formatSingleMemo(mockMemo, false);

      expect(result).toEqual({
        id: 2,
        content: '일반 메모',
        createdAt: new Date('2024-01-02'),
        user: { id: 20, nickname: '사용자' },
        isWidgetMemo: false,
      });
    });

    it('should use default isWidgetMemo value (false)', () => {
      const mockMemo = {
        id: 3,
        content: '기본값 테스트',
        createdAt: new Date('2024-01-03'),
        writer: { id: 30, nickname: '테스터' },
      };

      const result = formatSingleMemo(mockMemo);

      expect(result.isWidgetMemo).toBe(false);
    });
  });
});