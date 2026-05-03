<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Chart, registerables } from "chart.js";
	import type { ChartPoint } from "$lib/types/dashboard";

	let {
		data,
		label = "Visitors",
		className = ""
	}: {
		data: ChartPoint[];
		label?: string;
		className?: string;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;
	let mounted = false;

	Chart.register(...registerables); // ✅ Move outside — register once, not on every render

	const createChart = () => {
		if (!canvas || !mounted) return; // ✅ Guard: don't run before mount

		if (chart) {
			chart.destroy();
			chart = null;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// ✅ Fallback to hardcoded values if CSS vars aren't loaded yet
		const styles = getComputedStyle(document.documentElement);
		const primary = styles.getPropertyValue("--primary").trim() || "#ffffff";
		const muted = styles.getPropertyValue("--muted").trim() || "#0a0a0a";
		const mutedFg = styles.getPropertyValue("--muted-foreground").trim() || "#888888";

		const gradient = ctx.createLinearGradient(0, 0, 0, 250);
		gradient.addColorStop(0, `${primary}08`);
		gradient.addColorStop(0.8, `${primary}03`);
		gradient.addColorStop(1, `${primary}00`);

		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];
		const formatDate = (dateStr: string) => {
			const date = new Date(dateStr);
			return `${monthNames[date.getMonth()]} ${date.getDate()}`;
		};

		chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: data.map((d) => formatDate(d.date)),
				datasets: [
					{
						label,
						data: data.map((d) => d.visitors),
						borderColor: mutedFg,
						backgroundColor: gradient,
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 4,
						pointHoverBackgroundColor: muted,
						pointHoverBorderColor: primary,
						pointHoverBorderWidth: 2,
						borderWidth: 1.5
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: muted,
						titleColor: mutedFg,
						bodyColor: primary,
						padding: 10,
						cornerRadius: 6,
						displayColors: false,
						callbacks: {
							label: (ctx) => `${(ctx.parsed.y ?? 0).toLocaleString()} views`
						}
					}
				},
				scales: {
					x: {
						grid: { display: false },
						ticks: { color: mutedFg, maxTicksLimit: 6, font: { size: 11 } },
						border: { display: false },
						afterFit: (scale) => {
							scale.paddingLeft = 0;
							scale.paddingRight = 0;
						}
					},
					y: {
						display: false,
						grid: { display: false },
						ticks: { display: false },
						border: { display: false }
					}
				},
				interaction: { intersect: false, mode: "index" }
			}
		});
	};

	// ✅ $effect only — don't also call in onMount (double render)
	$effect(() => {
		if (data && canvas && mounted) {
			createChart();
		}
	});

	onMount(() => {
		mounted = true;
		// ✅ Defer to next tick so canvas bind:this is guaranteed
		requestAnimationFrame(() => {
			createChart();
		});
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<div class="h-full min-h-62.5 w-full {className}">
	<canvas bind:this={canvas}></canvas>
</div>
