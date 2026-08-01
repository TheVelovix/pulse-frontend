import { Bot, Monitor, Smartphone } from "lucide-react";
import {
  SiBrave,
  SiFirefoxbrowser,
  SiGooglechrome,
  SiOpera,
  SiSafari,
  SiSamsung,
  SiVivaldi,
  SiApple,
  SiLinux,
  SiAndroid,
  SiUbuntu,
  SiGoogle,
  SiLg,
  SiHuawei,
  SiXiaomi,
  SiOneplus,
  SiMotorola,
  SiSony,
  SiHtc,
  SiNokia,
} from "react-icons/si";
import { FaEdge, FaInternetExplorer, FaWindows } from "react-icons/fa";

export function getFaviconUrl(referrerUrl: string, size = 64) {
  const domain = new URL(referrerUrl).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

export function normalizeBrowserKey(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("bot") || lower.includes("spider") || lower === "crawler") {
    return "bot";
  }
  return raw.replace(/ mobile$/i, "");
}

export const browserIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Chrome: SiGooglechrome,
  Firefox: SiFirefoxbrowser,
  Safari: SiSafari,
  Opera: SiOpera,
  Edge: FaEdge,
  IE: FaInternetExplorer,
  Brave: SiBrave,
  Vivaldi: SiVivaldi,
  "Samsung Internet": SiSamsung,
  bot: Bot,
};

export function normalizeOsKey(raw: string): string {
  const trimmed = raw.trim();

  if (trimmed.startsWith("Mac OS X") || trimmed === "macOS") return "macOS";
  if (trimmed.startsWith("iOS")) return "iOS";
  if (trimmed.startsWith("Windows")) return "Windows"; // covers "Windows NT" too
  if (trimmed.startsWith("Android")) return "Android";
  if (trimmed === "Ubuntu") return "Ubuntu";
  if (trimmed === "Chrome OS") return "ChromeOS";
  if (trimmed === "Linux") return "Linux";

  return trimmed;
}

export const osIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  macOS: SiApple,
  iOS: SiApple,
  Windows: FaWindows,
  Linux: SiLinux,
  Ubuntu: SiUbuntu,
  Android: SiAndroid,
  ChromeOS: SiGooglechrome,
};

export const osBrandColors: Record<string, string> = {
  macOS: "#A3AAAE",
  iOS: "#A3AAAE",
  Windows: "#0078D7",
  Linux: "#FCC624",
  Ubuntu: "#E95420",
  Android: "#3DDC84",
  ChromeOS: "#4285F4",
};

export function normalizeDeviceBrandKey(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "Other";
  return trimmed;
}

export const deviceBrandIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Apple: SiApple,
  Google: SiGoogle,
  Samsung: SiSamsung,
  LG: SiLg,
  Huawei: SiHuawei,
  Xiaomi: SiXiaomi,
  OnePlus: SiOneplus,
  Motorola: SiMotorola,
  Sony: SiSony,
  HTC: SiHtc,
  Nokia: SiNokia,
  Spider: Bot,
  Generic_Android: SiAndroid,
  Generic_Android_Tablet: SiAndroid,
  Generic: Smartphone,
  Other: Monitor,
};
