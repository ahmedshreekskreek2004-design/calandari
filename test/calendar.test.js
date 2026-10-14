import { describe, it, expect } from 'vitest';
import { formatDateKey } from '../js/formatdate.js';

describe('formatDateKey', () => {
    it('formats the date correctly', () => {
        expect(formatDateKey(2026, 9, 5))
            .toBe('2026-10-05');
    });
});