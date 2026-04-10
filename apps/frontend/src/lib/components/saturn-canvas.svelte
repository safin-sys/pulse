<script lang="ts">
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	let animationId: number;

	interface Particle {
		angle: number;
		speed: number;
		radiusX: number;
		radiusY: number;
		size: number;
		opacity: number;
		type: "dust" | "ring" | "satellite";
	}

	onMount(() => {
		const ctx = canvas.getContext("2d")!;

		let W = 0,
			H = 0;
		let cx = 0,
			cy = 0;
		let SR = 0;

		// Tilt: ring major axis points from 10 o'clock (300°) to 4 o'clock (120°)
		// That's −60° from horizontal = −π/3
		const TILT = -Math.PI / 6;

		let particles: Particle[] = [];

		function resize() {
			W = canvas.width = window.innerWidth;
			H = canvas.height = window.innerHeight;

			const mobile = W < 768;

			if (mobile) {
				SR = Math.min(W, H) * 0.32;
				cx = W * 0.9;
				cy = H * 0.58;
			} else {
				SR = Math.min(H * 0.28, W * 0.18);
				cx = W * 0.73;
				cy = H * 0.5;
			}

			buildParticles();
		}

		function buildParticles() {
			particles = [];

			// Dense ring lanes close to saturn
			const ringLanes = [1.52, 1.68, 1.84, 2.02, 2.22, 2.4];
			for (const f of ringLanes) {
				const count = Math.floor(f * 40);
				const rX = SR * f;
				const rY = rX * 0.21;
				for (let i = 0; i < count; i++) {
					particles.push({
						angle: (Math.PI * 2 * i) / count + Math.random() * 0.06,
						speed: (0.00035 + Math.random() * 0.00025) * (Math.random() < 0.5 ? 1 : -1),
						radiusX: rX + (Math.random() - 0.5) * SR * 0.05,
						radiusY: rY + (Math.random() - 0.5) * SR * 0.012,
						size: 0.5 + Math.random() * 1.3,
						opacity: 0.3 + Math.random() * 0.6,
						type: "ring"
					});
				}
			}

			// Diffuse dust cloud further out
			const dustLanes = [2.8, 3.2, 3.7, 4.2, 4.8];
			for (const f of dustLanes) {
				const count = Math.floor(f * 16);
				const rX = SR * f;
				const rY = rX * 0.27;
				for (let i = 0; i < count; i++) {
					particles.push({
						angle: Math.random() * Math.PI * 2,
						speed: (0.0001 + Math.random() * 0.00015) * (Math.random() < 0.5 ? 1 : -1),
						radiusX: rX + (Math.random() - 0.5) * SR * 0.18,
						radiusY: rY + (Math.random() - 0.5) * SR * 0.06,
						size: 0.4 + Math.random() * 0.9,
						opacity: 0.12 + Math.random() * 0.28,
						type: "dust"
					});
				}
			}

			// A few visible satellites
			const satRings = [
				{ f: 5.4, spd: 0.000075 },
				{ f: 6.5, spd: 0.00005 },
				{ f: 7.6, spd: 0.000032 }
			];
			for (const { f, spd } of satRings) {
				const rX = SR * f;
				const rY = rX * 0.3;
				particles.push({
					angle: Math.random() * Math.PI * 2,
					speed: spd,
					radiusX: rX,
					radiusY: rY,
					size: 2.5 + Math.random() * 1.0,
					opacity: 0.75 + Math.random() * 0.25,
					type: "satellite"
				});
			}
		}

		// Convert an angle on the tilted ellipse to canvas x,y
		function ellipsePoint(angle: number, rX: number, rY: number) {
			const lx = Math.cos(angle) * rX;
			const ly = Math.sin(angle) * rY;
			return {
				x: cx + lx * Math.cos(TILT) - ly * Math.sin(TILT),
				y: cy + lx * Math.sin(TILT) + ly * Math.cos(TILT)
			};
		}

		// Particles with sin(angle) > 0 are on the "back" half of the orbit
		function isBehindSaturn(angle: number): boolean {
			return Math.sin(angle) > 0;
		}

		function traceTiltedEllipse(rX: number, rY: number) {
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(TILT);
			ctx.scale(1, rY / rX);
			ctx.arc(0, 0, rX, 0, Math.PI * 2);
			ctx.restore();
		}

		function drawSaturn() {
			// Slightly lifted base (this is the biggest win)
			ctx.beginPath();
			ctx.arc(cx, cy, SR, 0, Math.PI * 2);
			ctx.fillStyle = "#0b0b0b"; // was #0a0a0a
			ctx.fill();

			// Slightly stronger edge definition
			ctx.beginPath();
			ctx.arc(cx, cy, SR, 0, Math.PI * 2);
			ctx.strokeStyle = "rgba(255,255,255,0.06)"; // was 0.04
			ctx.lineWidth = 3;
			ctx.stroke();
		}

		function drawRingLines(behind: boolean) {
			const ringLanes = [1.52, 1.68, 1.84, 2.02, 2.22, 2.4];

			for (let i = 0; i < ringLanes.length; i++) {
				const f = ringLanes[i];
				const rX = SR * f;
				const rY = rX * 0.21;

				ctx.save();
				ctx.translate(cx, cy);
				ctx.rotate(TILT);
				ctx.scale(1, rY / rX);

				ctx.beginPath();

				// 🔑 THIS is the important part
				if (behind) {
					// back half
					ctx.arc(0, 0, rX, 0, Math.PI);
				} else {
					// front half
					ctx.arc(0, 0, rX, Math.PI, Math.PI * 2);
				}

				const alpha = behind ? 0.05 + i * 0.012 : 0.09 + i * 0.018;

				ctx.strokeStyle = `rgba(220,215,205,${alpha})`;
				ctx.lineWidth = behind ? 0.5 : 0.75;

				ctx.stroke();
				ctx.restore();
			}
		}

		function drawParticles(behind: boolean) {
			for (const p of particles) {
				if (isBehindSaturn(p.angle) !== behind) continue;
				const pos = ellipsePoint(p.angle, p.radiusX, p.radiusY);
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
				const alpha = behind ? p.opacity * 0.45 : p.opacity;
				ctx.fillStyle = `rgba(230,225,210,${alpha})`;
				ctx.fill();
			}
		}

		function draw() {
			ctx.clearRect(0, 0, W, H);
			drawParticles(true);
			drawRingLines(true);
			drawSaturn();
			drawRingLines(false);
			drawParticles(false);
		}

		function loop() {
			for (const p of particles) p.angle += p.speed;
			draw();
			animationId = requestAnimationFrame(loop);
		}

		resize();
		window.addEventListener("resize", resize);
		loop();

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute inset-0 z-0"></canvas>
