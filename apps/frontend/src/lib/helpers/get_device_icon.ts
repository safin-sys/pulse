const os = {
	AIX: "AIX",
	Android: "AND",
	AmigaOS: "AMG",
	tvOS: "ATV",
	"Arch Linux": "ARL",
	BackTrack: "BTR",
	Bada: "SBA",
	BeOS: "BEO",
	"BlackBerry OS": "BLB",
	"BlackBerry Tablet OS": "QNX",
	"Caixa Mágica": "CAI",
	CentOS: "CES",
	"Chrome OS": "COS",
	CyanogenMod: "CYN",
	Debian: "DEB",
	Deepin: "DEE",
	DragonFly: "DFB",
	Fedora: "FED",
	"Firefox OS": "FOS",
	"Fire OS": "FIR",
	FreeBSD: "BSD",
	FydeOS: "FYD",
	Gentoo: "GNT",
	"Google TV": "GTV",
	"HP-UX": "HPX",
	"Haiku OS": "HAI",
	iPadOS: "IPA",
	HarmonyOS: "HAR",
	KaiOS: "KOS",
	Knoppix: "KNO",
	Kubuntu: "KBT",
	Linux: "LIN",
	Lubuntu: "LBT",
	macOS: "MAC",
	Maemo: "MAE",
	Mageia: "MAG",
	Mandriva: "MDR",
	MeeGo: "SMG",
	Mint: "MIN",
	MorphOS: "MOR",
	NetBSD: "NBS",
	Nintendo: "WII",
	"Nintendo Mobile": "NDS",
	"OS/2": "OS2",
	OpenBSD: "OBS",
	OpenWrt: "OWR",
	PCLinuxOS: "PCL",
	"PlayStation Portable": "PSP",
	PlayStation: "PS3",
	"Raspberry Pi": "RAS",
	"Red Hat": "RHT",
	"RISC OS": "ROS",
	"Roku OS": "ROK",
	Rosa: "RSO",
	"Remix OS": "REM",
	REX: "REX",
	Sabayon: "SAB",
	SUSE: "SSE",
	"Sailfish OS": "SAF",
	Slackware: "SLW",
	Solaris: "SOS",
	Syllable: "SYL",
	Symbian: "SYM",
	"Symbian OS": "SYS",
	"Symbian OS Series 40": "S40",
	"Symbian OS Series 60": "S60",
	"Symbian^3": "SY3",
	ThreadX: "TDX",
	Tizen: "TIZ",
	Ubuntu: "UBT",
	watchOS: "WAS",
	"Whale OS": "WHS",
	Windows: "WIN",
	"Windows CE": "WCE",
	"Windows IoT": "WIO",
	"Windows Mobile": "WMO",
	"Windows Phone": "WPH",
	"Windows RT": "WRT",
	Xbox: "XBX",
	Xubuntu: "XBT",
	YunOs: "YNS",
	iOS: "IOS",
	palmOS: "POS",
	webOS: "WOS"
};

const BROWSER_NAME_MAP: Record<string, string> = {
	// Chrome variants
	chrome: "chrome",
	"mobile chrome": "chrome",
	"headless chrome": "chrome",
	"chrome webview": "chrome",
	"chrome mobile": "chrome",
	"chrome mobile ios": "chrome",
	"chrome beta": "chromebeta",
	"chrome canary": "chromecanary",
	"chrome dev": "chromedev",

	// Firefox variants
	firefox: "firefox",
	"mobile firefox": "firefox",
	"firefox mobile": "firefox",
	"firefox beta": "firefoxbeta",
	"firefox developer edition": "firefoxdeveloper",
	"firefox lite": "firefoxlite",
	"firefox reality": "firefoxreality",

	// Safari variants
	safari: "safari",
	"mobile safari": "safari",
	"safari mobile": "safari",

	// Samsung
	"samsung browser": "samsunginternet",
	"samsung internet": "samsunginternet",
	"samsung browser beta": "samsunginternetbeta",
	"samsung internet beta": "samsunginternetbeta",

	// Edge
	edge: "edge",
	"edge mobile": "edge",
	"microsoft edge": "edge",

	// Opera
	opera: "opera",
	"opera gx": "operagx",
	"opera mobile": "opera",
	"opera mini": "opera",
	"opera mobi": "opera",

	// IE
	ie: "internetexplorer",
	"internet explorer": "internetexplorer",

	// Others
	"aol browser": "aolexplorer",
	arora: "arora",
	"bezilla browser": "bezillabrowser",
	brave: "brave",
	"brave dev": "bravedev",
	browsh: "browsh",
	chromium: "chromium",
	deno: "deno",
	duckduckgo: "duckduckgo",
	"duckduckgo privacy browser": "duckduckgo",
	electron: "electron",
	falkon: "falkon",
	geckoview: "geckoview",
	hermes: "hermes",
	"huawei browser": "huawei",
	icecat: "icecat",
	iceweasel: "iceweasel",
	konqueror: "konqueror",
	maxthon: "maxthon",
	midori: "midori",
	netscape: "netscape",
	netsurf: "netsurf",
	node: "node",
	"node.js": "node",
	qutebrowser: "qutebrowser",
	spidermonkey: "spidermonkey",
	"tor browser": "tor",
	tor: "tor",
	"uc browser": "ucbrowser",
	vivaldi: "vivaldi",
	"yandex browser": "yandex",
	yandex: "yandex"
};

const normalizeBrowserName = (name: string): string | null => {
	const lower = name.toLowerCase().trim();
	return BROWSER_NAME_MAP[lower] ?? null;
};

export const get_device_icon = (
	name: string,
	type: "browser" | "os" | "device" | undefined
): string | null => {
	if (type === "browser") {
		const normalized = normalizeBrowserName(name);
		if (!normalized) return null;
		return `https://raw.githubusercontent.com/sharifanis/browser-icon/refs/heads/main/icon/${normalized}.svg`;
	}
	if (type === "os") {
		const code = (os as Record<string, string>)?.[name];
		if (!code) return null;
		return `https://raw.githubusercontent.com/EgoistDeveloper/operating-system-logos/master/src/48x48/${code}.png`;
	}

	return null;
};
