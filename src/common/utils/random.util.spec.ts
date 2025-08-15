import { generateRandomString } from './random.util';

describe('Random Utils', () => {
  describe('generateRandomString', () => {
    it('should generate a string', () => {
      const result = generateRandomString();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should generate unique strings', () => {
      const result1 = generateRandomString();
      const result2 = generateRandomString();

      expect(result1).not.toBe(result2);
    });

    it('should generate UUID v4 format', () => {
      const result = generateRandomString();

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(result).toMatch(uuidRegex);
    });
  });
});
