<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import Address from '$lib/components/invoice/Address.svelte';
	import IssueDate from '$lib/components/invoice/IssueDate.svelte';
	import Heading from '$lib/components/invoice/Heading.svelte';
	import ColumnHeadings from '$lib/components/invoice/ColumnHeadings.svelte';
	import Spacer from '$lib/components/invoice/Spacer.svelte';
	import LineItem from '$lib/components/invoice/LineItem.svelte';
	import Total from '$lib/components/invoice/Total.svelte';
	import { Logo } from '@invoicelink/ui';
	import type { InvoiceStyles } from '@prisma/client';
	import type { FullInvoice } from '$lib/types';
	import Banking from './invoice/Banking.svelte';

	export let editable: boolean = false;
	export let styles: InvoiceStyles;
	export let data: FullInvoice;

	let stringIssueDate: string = data.issueDate.toLocaleDateString('en-ZA').replaceAll('/', '-');

	$: {
		data.subtotal = parseFloat(
			data.lineItems
				.reduce((acc, item) => {
					return acc + item.amount;
				}, 0)
				.toFixed(2)
		);

		data.tax = parseFloat(((data.subtotal * data.taxPercentage) / 100).toFixed(2));

		data.total = parseFloat((data.subtotal + data.tax).toFixed(2));

		data.issueDate = new Date(stringIssueDate);
	}

	$: console.log(data);
</script>

<div
	data-theme="light"
	id="invoice_template"
	class={twMerge('bg-base-100 min-h-full w-full flex-grow rounded-lg', styles.baseFontSize)}
>
	<div class="w-full p-4 sm:p-10">
		<div class="flex justify-between leading-6">
			<Logo data={{ alt: styles.logoAlt, src: styles.logoSrc ?? undefined }} />
			<Heading
				data={{
					serial: data.serial
				}}
				size={styles.invoiceTypeFontSize}
				text={styles.invoiceType}
				color={styles.invoiceTypeColor}
				casing={styles.invoiceTypeCasing}
			/>
		</div>
		<Spacer divider={'hidden'} spacing={styles.baseSpacing} color={styles.baseDividerColor} />
		<div class="grid grid-cols-1 leading-6">
			<IssueDate {editable} align={styles.issueDateAlign} bind:date={stringIssueDate} />
			<Spacer
				divider={styles.baseDivider}
				spacing={styles.baseSpacing}
				color={styles.baseDividerColor}
			/>
			<div class="flex gap-x-4">
				<Address
					name={data.user.name ?? ''}
					data={data.sendersAddress}
					align={styles.senderAddressAlign}
					vatNumber={data.user.vatNumber}
					showVATNumber={styles.showVATNumber}
				/>
				<Address
					name={data.client.name}
					data={data.client.address}
					align={styles.recipientAddressAlign}
					vatNumber={data.client.vatNumber}
					showVATNumber={styles.showVATNumber}
				/>
			</div>
		</div>
		<Spacer
			divider={styles.baseDivider}
			spacing={styles.baseSpacing}
			color={styles.baseDividerColor}
		/>
		<div id="table" class="whitespace-nowrap text-left leading-6">
			<ColumnHeadings
				size={styles.columnHeadingSize}
				color={styles.columnHeadingColor}
				divider={styles.columnHeadingDivider}
				casing={styles.columnHeadingCasing}
				dividerColor={styles.baseDividerColor}
			/>
			<div id="table-body" class="flex w-full flex-col">
				{#each data.lineItems as lineItem}
					<LineItem
						{editable}
						bind:unitPrice={lineItem.unitPrice}
						bind:description={lineItem.description}
						bind:amount={lineItem.amount}
						bind:quantity={lineItem.quantity}
						divider={styles.lineItemDivider}
						dividerColor={styles.baseDividerColor}
						lineItemFontSize={styles.baseFontSize}
					/>
				{/each}
			</div>
			<Spacer divider={'hidden'} spacing={styles.baseSpacing} color={styles.baseDividerColor} />
			<Total {data} {styles} />
		</div>
		<Spacer
			divider={styles.baseDivider}
			spacing={styles.baseSpacing}
			color={styles.baseDividerColor}
		/>
		<Banking data={data.user.bankAccount[0]} align={styles.bankDetailsAlign} />
	</div>
</div>
