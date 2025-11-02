/**
 * Theme toggle functionality
 * Manages light/dark/auto theme switching with localStorage persistence
 */

const STORAGE_KEY = "theme-pref-v1";
const MODES = ["light", "dark", "auto"] as const;
type ThemeMode = (typeof MODES)[number];

function systemPref(): "light" | "dark" {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyResolved(mode: ThemeMode): void {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const effective = mode === "auto" ? systemPref() : mode;
  const dark = effective === "dark";

  root.classList.toggle("theme-dark", dark);
  btn.setAttribute("data-theme-state", dark ? "dark" : "light");
  btn.setAttribute("aria-pressed", dark ? "true" : "false");

  const labelMap: Record<ThemeMode, string> = {
    light: "Switch to dark theme",
    dark: "Switch to auto theme",
    auto: "Switch to light theme",
  };
  btn.setAttribute("aria-label", labelMap[mode] || "Toggle theme");
  btn.setAttribute("data-mode", mode);
}

/**
 * Initializes theme toggle button and handles user preference
 */
export function initThemeToggle(): void {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  // Load stored preference
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {}

  let currentMode: ThemeMode =
    stored === "light" || stored === "dark" || stored === "auto"
      ? stored
      : "auto";

  applyResolved(currentMode);
  btn.setAttribute("data-mode", currentMode);

  // Listen to system preference changes
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const mqHandler = () => {
    if (currentMode === "auto") applyResolved("auto");
  };
  mq.addEventListener
    ? mq.addEventListener("change", mqHandler)
    : mq.addListener(mqHandler);

  // Handle button clicks
  btn.addEventListener("click", () => {
    const idx = MODES.indexOf(currentMode);
    currentMode = MODES[(idx + 1) % MODES.length];
    applyResolved(currentMode);
    try {
      localStorage.setItem(STORAGE_KEY, currentMode);
    } catch {}
  });
}

// Auto-init when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initThemeToggle();
}
