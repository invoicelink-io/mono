import type {
	Client,
	Invoice,
	LineItem,
	Address,
	User,
	QuickLink,
	BankAccount,
	InvoiceStyles
} from '@prisma/client';

// place files you want to import through the `$lib` alias in this folder.
export type PaymentGateways = 'payfast' | 'paypal' | 'yoco';

export type FullInvoice = Invoice & {
	user: User & {
		bankAccount?: BankAccount[];
	};
	sendersAddress: Address;
	client: Client & {
		address: Address;
	};
	lineItems: LineItem[];
	invoiceStyle?: InvoiceStyles;
};

export type FullQuickLink = QuickLink & {
	user: User & {
		bankAccount?: BankAccount[];
	};
	sendersAddress: Address;
};
