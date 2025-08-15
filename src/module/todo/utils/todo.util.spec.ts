import { groupTodosByUser, formatSoloTodoData } from './todo.util';

describe('Todo Utils', () => {
  describe('groupTodosByUser', () => {
    it('should group todos by user correctly', () => {
      const mockTodos = [
        {
          id: 1,
          writerId: 10,
          content: '사용자A의 첫 번째 투두',
          isDone: false,
        },
        {
          id: 2,
          writerId: 20,
          content: '사용자B의 첫 번째 투두',
          isDone: true,
        },
        {
          id: 3,
          writerId: 10,
          content: '사용자A의 두 번째 투두',
          isDone: false,
        },
        {
          id: 4,
          writerId: 20,
          content: '사용자B의 두 번째 투두',
          isDone: false,
        },
      ];

      const mockUsers = {
        a: { id: 10, nickname: '사용자A' },
        b: { id: 20, nickname: '사용자B' },
      };

      const result = groupTodosByUser(mockTodos, mockUsers);

      expect(result).toEqual({
        10: {
          nickname: '사용자A',
          todos: [
            {
              id: 1,
              writerId: 10,
              content: '사용자A의 첫 번째 투두',
              isDone: false,
            },
            {
              id: 3,
              writerId: 10,
              content: '사용자A의 두 번째 투두',
              isDone: false,
            },
          ],
        },
        20: {
          nickname: '사용자B',
          todos: [
            {
              id: 2,
              writerId: 20,
              content: '사용자B의 첫 번째 투두',
              isDone: true,
            },
            {
              id: 4,
              writerId: 20,
              content: '사용자B의 두 번째 투두',
              isDone: false,
            },
          ],
        },
      });
    });

    it('should handle empty todos for one user', () => {
      const mockTodos = [
        { id: 1, writerId: 10, content: '사용자A만 있는 투두', isDone: false },
      ];

      const mockUsers = {
        a: { id: 10, nickname: '사용자A' },
        b: { id: 20, nickname: '사용자B' },
      };

      const result = groupTodosByUser(mockTodos, mockUsers);

      expect(result).toEqual({
        10: {
          nickname: '사용자A',
          todos: [
            {
              id: 1,
              writerId: 10,
              content: '사용자A만 있는 투두',
              isDone: false,
            },
          ],
        },
        20: {
          nickname: '사용자B',
          todos: [], // 빈 배열
        },
      });
    });

    it('should handle completely empty todos', () => {
      const mockTodos = [];
      const mockUsers = {
        a: { id: 10, nickname: '사용자A' },
        b: { id: 20, nickname: '사용자B' },
      };

      const result = groupTodosByUser(mockTodos, mockUsers);

      expect(result).toEqual({
        10: {
          nickname: '사용자A',
          todos: [],
        },
        20: {
          nickname: '사용자B',
          todos: [],
        },
      });
    });
  });

  describe('formatSoloTodoData', () => {
    it('should format solo todo data correctly', () => {
      const userId = 100;
      const mockUser = { id: 100, nickname: '솔로유저' };
      const mockTodos = [
        { id: 1, writerId: 100, content: '개인 투두 1', isDone: false },
        { id: 2, writerId: 100, content: '개인 투두 2', isDone: true },
      ];

      const result = formatSoloTodoData(userId, mockUser, mockTodos);

      expect(result).toEqual({
        100: {
          nickname: '솔로유저',
          todos: [
            { id: 1, writerId: 100, content: '개인 투두 1', isDone: false },
            { id: 2, writerId: 100, content: '개인 투두 2', isDone: true },
          ],
        },
      });
    });

    it('should handle empty todos for solo user', () => {
      const userId = 100;
      const mockUser = { id: 100, nickname: '솔로유저' };
      const mockTodos = [];

      const result = formatSoloTodoData(userId, mockUser, mockTodos);

      expect(result).toEqual({
        100: {
          nickname: '솔로유저',
          todos: [],
        },
      });
    });

    it('should use dynamic userId as key', () => {
      const userId = 999;
      const mockUser = { id: 999, nickname: '다른유저' };
      const mockTodos = [
        { id: 1, writerId: 999, content: '투두', isDone: false },
      ];

      const result = formatSoloTodoData(userId, mockUser, mockTodos);

      expect(result).toHaveProperty('999');
      expect(result[999].nickname).toBe('다른유저');
    });
  });
});
