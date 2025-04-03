<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import toast from 'svelte-french-toast';
	import { Button, Divider } from '@invoicelink/ui';

	const { form, enhance, message, submitting } = superForm($page.data.vatForm, {
		resetForm: false,
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success($message);
			} else {
				toast.error($message ?? 'Invalid');
			}
		},
		onError: () => {
			toast.error($message ?? 'Something went wrong');
		}
	});
</script>

<Divider>VAT details to be displayed on invoices</Divider>

<form method="POST" id="vat-settings" action="?/updateVAT" use:enhance>
	<input hidden name="id" value={$form.id} />
	<ul role="list" class="settings-list">
		<li>
			<label for="vatNumber" class="label-primary">VAT Number</label>
			<input
				name="vatNumber"
				type="text"
				class="input-primary"
				placeholder="4123456789"
				bind:value={$form.vatNumber}
			/>
		</li>
	</ul>
	<div class="flex justify-end py-4">
		<Button
			formaction="?/updateVAT"
			label="Update"
			loadingLabel="Updating"
			loading={$submitting}
			type="submit"
			variant="btn-primary"
		/>
	</div>
</form>
