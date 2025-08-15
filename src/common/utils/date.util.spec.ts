import {
  getDDay,
  getDays,
  getUpcomingAnniversary,
  getDaysToNextBirthday,
} from './date.util';

describe('Date Utils', () => {
  describe('getDDay', () => {
    it('should return correct elapsed days from anniversary', () => {
      // 100일 전 날짜
      const anniversary = new Date();
      anniversary.setDate(anniversary.getDate() - 100);

      const result = getDDay(anniversary);
      expect(result).toBe(100);
    });

    it('should return 0 for today anniversary', () => {
      const today = new Date();
      const result = getDDay(today);
      expect(result).toBe(0);
    });

    it('should return negative number for future anniversary', () => {
      // 10일 후 날짜
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const result = getDDay(futureDate);
      expect(result).toBe(-10);
    });
  });

  describe('getDays', () => {
    it('should return correct remaining days to future date', () => {
      // 30일 후 날짜
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const result = getDays(futureDate);
      expect(result).toBe(30);
    });

    it('should return 0 for today', () => {
      const today = new Date();
      const result = getDays(today);
      expect(result).toBe(0);
    });

    it('should return negative number for past date', () => {
      // 5일 전 날짜
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      const result = getDays(pastDate);
      expect(result).toBe(-5);
    });
  });

  describe('getUpcomingAnniversary', () => {
    it('should return 100 days anniversary when closer than yearly anniversary', () => {
      const dday = 150; // 현재 150일
      const anniversary = new Date('2023-01-01');

      const result = getUpcomingAnniversary(dday, anniversary);

      expect(result.type).toBe('200일');
      expect(result.days).toBe(50); // 200 - 150
      expect(result.id).toBe(1);
    });

    it('should return yearly anniversary when closer than 100 days anniversary', () => {
      const dday = 320; // 현재 320일
      const anniversary = new Date('2023-01-01');

      const result = getUpcomingAnniversary(dday, anniversary);

      expect(result.type).toBe('1주년');
      expect(result.days).toBe(45); // 365 - 320
      expect(result.id).toBe(1);
    });

    it('should handle edge case at exact 100 days', () => {
      const dday = 100;
      const anniversary = new Date('2023-01-01');

      const result = getUpcomingAnniversary(dday, anniversary);

      // 현재 로직: Math.ceil(100/100) = 1, nextHundred = 100
      expect(result.type).toBe('100일');
      expect(result.days).toBe(0); // 100 - 100 = 0
    });
  });

  describe('getDaysToNextBirthday', () => {
    beforeEach(() => {
      // 테스트를 위해 현재 날짜를 2024년 6월 15일로 고정
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-06-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return days to birthday this year if birthday has not passed', () => {
      const birthday = new Date('1990-12-25'); // 크리스마스 생일

      const result = getDaysToNextBirthday(birthday);

      expect(result.days).toBe(193); // 6월 15일부터 12월 25일까지
      expect(result.date.getMonth()).toBe(11); // 12월 (0-based)
      expect(result.date.getDate()).toBe(25);
      expect(result.date.getFullYear()).toBe(2024);
    });

    it('should return days to birthday next year if birthday has passed', () => {
      const birthday = new Date('1990-03-10'); // 3월 생일 (이미 지남)

      const result = getDaysToNextBirthday(birthday);

      expect(result.days).toBe(268); // 내년 3월 10일까지
      expect(result.date.getMonth()).toBe(2); // 3월 (0-based)
      expect(result.date.getDate()).toBe(10);
      expect(result.date.getFullYear()).toBe(2025);
    });

    it('should return 0 days if today is birthday', () => {
      const birthday = new Date('1990-06-15'); // 오늘이 생일

      const result = getDaysToNextBirthday(birthday);

      expect(result.days).toBe(0);
      expect(result.date.getMonth()).toBe(5); // 6월 (0-based)
      expect(result.date.getDate()).toBe(15);
      expect(result.date.getFullYear()).toBe(2024);
    });
  });
});
