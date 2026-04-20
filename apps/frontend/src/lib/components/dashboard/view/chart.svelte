<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Chart, registerables } from "chart.js";
	import type { ChartPoint } from "$lib/types/dashboard";

	let {
		data,
		label = "Visitors"
	}: {
		data: ChartPoint[];
		label?: string;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	const createChart = () => {
		if (chart) {
			chart.destroy();
		}

		Chart.register(...registerables);

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const gradient = ctx.createLinearGradient(0, 0, 0, 300);
		gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
		gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

		chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: data.map((d) => d.date),
				datasets: [
					{
						label,
						data: data.map((d) => d.visitors),
						borderColor: "#3b82f6",
						backgroundColor: gradient,
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 4,
						borderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						titleColor: "#fff",
						bodyColor: "#fff",
						padding: 12,
						cornerRadius: 8,
						displayColors: false
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							color: "rgba(255, 255, 255, 0.5)",
							maxTicksLimit: 8
						},
						border: {
							display: false
						}
					},
					y: {
						grid: {
							color: "rgba(255, 255, 255, 0.1)"
						},
						ticks: {
							color: "rgba(255, 255, 255, 0.5)",
							maxTicksLimit: 5
						},
						border: {
							display: false
						}
					}
				},
				interaction: {
					intersect: false,
					mode: "index"
				}
			}
		});
	};

	$effect(() => {
		if (data && canvas) {
			createChart();
		}
	});

	onMount(() => {
		createChart();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="w-full h-full min-h-[250px]">
	<canvas bind:this={canvas}></canvas>
</div>
