import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import { initializeSerialNumber, incrementSerialNumber } from './serialNumbers';
import { SerialType } from '@prisma/client';

test('initializeSerialNumber should return a string with the correct format for invoice type', () => {
	const result = initializeSerialNumber('INVOICE');
	expect(result).toMatch(/^INV-\d{4}-\d{5}$/);
});

test('initializeSerialNumber should return a string with the correct format for quick-link type', () => {
	const result = initializeSerialNumber('QUICK_LINK');
	expect(result).toMatch(/^QL-\d{4}-\d{5}$/);
});

test('incrementSerialNumber should increment the serial number correctly', () => {
	const serial = 'INV-2022-00001';
	const result = incrementSerialNumber(serial);
	expect(result).toBe('INV-2022-00002');
});

test('incrementSerialNumber should handle serial numbers with different prefixes', () => {
	const serial = 'QL-2022-00001';
	const result = incrementSerialNumber(serial);
	expect(result).toBe('QL-2022-00002');
});

test('incrementSerialNumber should handle serial numbers with different years', () => {
	const serial = 'INV-2023-00001';
	const result = incrementSerialNumber(serial);
	expect(result).toBe('INV-2023-00002');
});

test('incrementSerialNumber should handle serial numbers with different number lengths', () => {
	const serial = 'INV-2022-00099';
	const result = incrementSerialNumber(serial);
	expect(result).toBe('INV-2022-00100');
});

describe('Serial Number Generation', () => {
	let originalDate: DateConstructor;

	beforeEach(() => {
		// Store the original Date constructor
		originalDate = global.Date;
	});

	afterEach(() => {
		// Restore the original Date after each test
		global.Date = originalDate;
	});

	test('should use current year in serial number', () => {
		const currentYear = new Date().getFullYear();
		const result = initializeSerialNumber(SerialType.INVOICE);
		expect(result).toBe(`INV-${currentYear}-00001`);
	});

	test('should use correct year when year changes', () => {
		// Mock the Date to return a specific year
		const mockDate = new Date('2026-01-01');
		global.Date = class extends Date {
			constructor() {
				super();
				return mockDate;
			}
		} as DateConstructor;

		const result = initializeSerialNumber(SerialType.INVOICE);
		expect(result).toBe('INV-2026-00001');
	});

	test('should match the expected format', () => {
		const result = initializeSerialNumber(SerialType.INVOICE);
		expect(result).toMatch(/^INV-\d{4}-00001$/);
	});
});
