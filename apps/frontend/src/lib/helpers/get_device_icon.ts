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

export const get_device_icon = (
	name: string,
	type: "browser" | "os" | undefined
): string => {
	if (type === "browser") {
		return (
			`https://raw.githubusercontent.com/sharifanis/browser-icon/refs/heads/main/icon/${name.toLowerCase()}.svg` ||
			"🌐"
		);
	}
	if (type === "os") {
		return (
			`https://raw.githubusercontent.com/EgoistDeveloper/operating-system-logos/master/src/48x48/${(os as Record<string, string>)?.[name]}.png` ||
			"💻"
		);
	}

	return "🤷‍♀️";
};
