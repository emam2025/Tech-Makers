import { sanitize, sanitizePlain, validateEmail, validatePhone, validateName, validateInputLength } from '@/lib/security';

describe('Security Utils', () => {
  describe('sanitize', () => {
    it('escapes HTML entities', () => {
      expect(sanitize('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('escapes single quotes', () => {
      expect(sanitize("it's")).toBe("it&#x27;s");
    });

    it('escapes ampersands', () => {
      expect(sanitize('a & b')).toBe('a &amp; b');
    });

    it('returns empty string for non-string input', () => {
      expect(sanitize(null)).toBe('');
      expect(sanitize(undefined)).toBe('');
      expect(sanitize(123)).toBe('');
    });

    it('handles clean strings', () => {
      expect(sanitize('hello world')).toBe('hello world');
    });
  });

  describe('sanitizePlain', () => {
    it('removes dangerous characters', () => {
      expect(sanitizePlain('<script>test</script>')).toBe('scripttest/script');
    });

    it('returns empty string for non-string', () => {
      expect(sanitizePlain(null)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
      expect(validateEmail('user+tag@domain.com')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('accepts valid Egyptian phones', () => {
      expect(validatePhone('01012345678')).toBe(true);
      expect(validatePhone('010123456789')).toBe(true);
    });

    it('accepts international format', () => {
      expect(validatePhone('+201012345678')).toBe(true);
      expect(validatePhone('+1234567890')).toBe(true);
    });

    it('rejects invalid phones', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('accepts valid names', () => {
      expect(validateName('أحمد محمد')).toBe(true);
      expect(validateName('John Smith')).toBe(true);
      expect(validateName("O'Connor")).toBe(true);
    });

    it('rejects short names', () => {
      expect(validateName('أب')).toBe(false);
      expect(validateName('John')).toBe(false);
    });

    it('rejects names with numbers', () => {
      expect(validateName('Ahmed123')).toBe(false);
    });
  });

  describe('validateInputLength', () => {
    it('returns null for valid data', () => {
      expect(validateInputLength({ name: 'أحمد محمد' })).toBeNull();
    });

    it('returns error for exceeding limit', () => {
      const longName = 'a'.repeat(101);
      expect(validateInputLength({ name: longName })).toContain('name');
    });

    it('ignores non-string values', () => {
      expect(validateInputLength({ age: 25 })).toBeNull();
    });
  });
});
