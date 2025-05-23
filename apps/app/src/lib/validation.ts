import { z } from 'zod';

export const currencyEnumSchema = z.enum(['AED', 'CAD', 'EUR', 'GBP', 'INR', 'USD', 'ZAR']);

export const currencySchema = z.object({
	id: z.string().optional(),
	currency: currencyEnumSchema
});

export const userSchema = z.object({
	id: z.string().optional(),
	name: z.string()
});

export const addressSchema = z.object({
	id: z.string().optional(),
	line1: z.string(),
	line2: z.string().nullable(),
	line3: z.string().nullable(),
	postalCode: z.coerce.string()
});

export const bankSchema = z.object({
	id: z.string().optional(),
	accountHolder: z.string(),
	accountNo: z.string(),
	accountType: z.string(),
	bankName: z.string(),
	branchCode: z.string()
});

export const vatSchema = z.object({
	id: z.string(),
	vatNumber: z.string().nullable()
});
