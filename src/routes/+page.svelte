<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	interface Item {
		id: number;
		name: string;
		description: string;
		status: string;
		created_at: string;
	}

	let items: Item[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const { data, error: fetchError } = await supabase
				.from('items')
				.select('*')
				.order('created_at', { ascending: false });

			if (fetchError) throw fetchError;
			items = data || [];
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
			console.error('Error fetching items:', e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
				<span class="block">SvelteKit Template</span>
				<span class="block text-indigo-600">with Supabase & Vercel</span>
			</h1>
			<p
				class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
			>
				A production-ready template with Tailwind CSS, Supabase, GitHub Actions, and Vercel
				deployment.
			</p>
		</div>

		<div class="mt-12">
			<div class="overflow-hidden bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:px-6">
					<h2 class="text-2xl font-semibold leading-6 text-gray-900">Items Table</h2>
					<p class="mt-1 max-w-2xl text-sm text-gray-500">Sample data from Supabase</p>
				</div>

				<div class="border-t border-gray-200">
					{#if loading}
						<div class="flex items-center justify-center py-12">
							<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
						</div>
					{:else if error}
						<div class="bg-red-50 p-4">
							<div class="flex">
								<div class="ml-3">
									<h3 class="text-sm font-medium text-red-800">Error loading data</h3>
									<div class="mt-2 text-sm text-red-700">
										<p>{error}</p>
									</div>
								</div>
							</div>
						</div>
					{:else if items.length === 0}
						<div class="bg-yellow-50 p-4">
							<div class="flex">
								<div class="ml-3">
									<h3 class="text-sm font-medium text-yellow-800">No items found</h3>
									<div class="mt-2 text-sm text-yellow-700">
										<p>Run the Supabase migrations to seed data.</p>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead class="bg-gray-50">
									<tr>
										<th
											scope="col"
											class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>
											ID
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>
											Name
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>
											Description
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>
											Status
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
										>
											Created At
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 bg-white">
									{#each items as item (item.id)}
										<tr class="hover:bg-gray-50">
											<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
												{item.id}
											</td>
											<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
												{item.name}
											</td>
											<td class="px-6 py-4 text-sm text-gray-500">
												{item.description}
											</td>
											<td class="whitespace-nowrap px-6 py-4">
												<span
													class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 {item.status ===
													'completed'
														? 'bg-green-100 text-green-800'
														: item.status === 'in-progress'
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-gray-100 text-gray-800'}"
												>
													{item.status}
												</span>
											</td>
											<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
												{new Date(item.created_at).toLocaleDateString()}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<p class="text-sm text-gray-500">
				Built with <a
					href="https://kit.svelte.dev"
					class="font-medium text-indigo-600 hover:text-indigo-500">SvelteKit</a
				>,
				<a href="https://supabase.com" class="font-medium text-indigo-600 hover:text-indigo-500"
					>Supabase</a
				>, and
				<a href="https://tailwindcss.com" class="font-medium text-indigo-600 hover:text-indigo-500"
					>Tailwind CSS</a
				>
			</p>
		</div>
	</div>
</div>
