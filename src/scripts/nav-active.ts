/**
 * Navigation active link indicator
 * Updates the active link pill based on current hash
 */

function updateActiveLink(): void {
  const hash = window.location.hash || "#about";
  document.querySelectorAll(".nav-link").forEach((a) => {
    if (a.getAttribute("href") === hash) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "true");
    } else {
      a.classList.remove("is-active");
      a.removeAttribute("aria-current");
    }
  });
}

// Listen for hash changes
window.addEventListener("hashchange", updateActiveLink, { passive: true });

// Initialize on load
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", updateActiveLink, { once: true });
} else {
  updateActiveLink();
}
