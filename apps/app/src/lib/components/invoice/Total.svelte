<script lang="ts">
	import { page } from '$app/stores';
	import { formatCurrency } from '@invoicelink/lib';
	import type { Invoice, QuickLink, InvoiceStyles } from '@prisma/client';

	export let data: Invoice | QuickLink;
	export let styles: InvoiceStyles;
</script>

<div id="table-footer" class="grid grid-cols-3 sm:grid-cols-4">
	<div class="col-span-2 flex flex-col items-end leading-6 sm:col-span-3">
		<span class="font-normal">Subtotal</span>
		<span class="font-normal">{styles.taxType}</span>
		<span class="font-semibold">Total</span>
	</div>
	<div class="flex flex-col leading-6">
		<span class="truncate text-right tabular-nums"
			>{formatCurrency(data?.subtotal, $page.data.locale, $page.data.currency)}</span
		>
		<span class="truncate text-right tabular-nums"
			>{formatCurrency(data?.tax, $page.data.locale, $page.data.currency)}</span
		>
		<span class="truncate text-right font-semibold tabular-nums"
			>{formatCurrency(data?.total, $page.data.locale, $page.data.currency)}</span
		>
	</div>
</div>
