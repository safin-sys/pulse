export const get_device_emoji = (name: string, type: "browser" | "os" | "device" | undefined): string => {
	if (type === "browser") {
		const emojis: Record<string, string> = {
			Chrome: "🅱️",
			Firefox: "🦊",
			Safari: "🧭",
			Edge: "📘"
		};
		return emojis[name] || "🌐";
	}
	if (type === "os") {
		const emojis: Record<string, string> = {
			Windows: "🪟",
			macOS: "🍎",
			Linux: "🐧",
			Android: "🤖",
			iOS: "📱"
		};
		return emojis[name] || "💻";
	}
	const emojis: Record<string, string> = {
		Desktop: "💻",
		Mobile: "📱",
		Tablet: "📲"
	};
	return emojis[name] || "📱";
};