import type { PageServerLoad, Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { addressSchema, bankSchema, vatSchema } from '$lib/validation';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ parent, locals, cookies }) => {
	await parent();
	const { user } = locals;

	const dbAddress = await prisma.address.findFirst({
		where: {
			userId: user?.id
		}
	});

	let address = dbAddress;
	if (!dbAddress) {
		// create an address entry
		address = await prisma.address.create({
			data: {
				line1: '',
				postalCode: '',
				user: {
					connect: {
						id: user?.id
					}
				}
			}
		});
	}

	const addressForm = await superValidate(address, zod(addressSchema));

	const dbBank = await prisma.bankAccount.findFirst({
		where: {
			userId: user?.id
		}
	});

	let bank = dbBank;
	if (!dbBank) {
		// create an address entry
		bank = await prisma.bankAccount.create({
			data: {
				accountHolder: '',
				bankName: '',
				accountNo: '',
				accountType: '',
				branchCode: '',
				user: {
					connect: {
						id: user?.id
					}
				}
			}
		});
	}

	const bankingForm = await superValidate(bank, zod(bankSchema));

	// Get user for VAT form
	const dbUser = await prisma.user.findUnique({
		where: {
			id: user?.id
		},
		select: {
			id: true,
			vatNumber: true
		}
	});

	const vatForm = await superValidate(dbUser, zod(vatSchema));

	return {
		user,
		title: 'Settings',
		theme: cookies.get('colortheme'),
		addressForm,
		bankingForm,
		vatForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateAddress: async ({ request, locals }) => {
		const form = await superValidate(request, zod(addressSchema));

		if (!form.valid) {
			return message(form, 'Invalid address details');
		}

		try {
			await prisma.address.update({
				where: {
					id: form.data.id,
					userId: locals.user?.id
				},
				data: {
					line1: form.data.line1,
					line2: form.data.line2,
					line3: form.data.line3,
					postalCode: form.data.postalCode
				}
			});

			return message(form, 'Address updated successfully');
		} catch (error) {
			console.error(error);
			return message(form, 'Failed to update address');
		}
	},
	updateBank: async ({ request, locals }) => {
		const form = await superValidate(request, zod(bankSchema));

		if (!form.valid) {
			return message(form, 'Invalid bank details');
		}

		try {
			await prisma.bankAccount.update({
				where: {
					id: form.data.id,
					userId: locals.user?.id
				},
				data: {
					accountHolder: form.data.accountHolder,
					accountNo: form.data.accountNo,
					accountType: form.data.accountType,
					bankName: form.data.bankName,
					branchCode: form.data.branchCode
				}
			});

			return message(form, 'Bank details updated successfully');
		} catch (error) {
			console.error(error);
			return message(form, 'Failed to update bank details');
		}
	},
	updateVAT: async ({ request, locals }) => {
		const form = await superValidate(request, zod(vatSchema));

		if (!form.valid) {
			return message(form, 'Invalid VAT number');
		}

		try {
			await prisma.user.update({
				where: {
					id: locals.user?.id
				},
				data: {
					vatNumber: form.data.vatNumber
				}
			});

			return message(form, 'VAT number updated successfully');
		} catch (error) {
			console.error(error);
			return message(form, 'Failed to update VAT number');
		}
	}
};
