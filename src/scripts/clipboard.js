/**
 * Simplified clipboard utility for copying git clone commands
 * Modern browsers (2025) all support navigator.clipboard API
 */
(function () {
  const live = document.getElementById("clone-status-live");

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      return false;
    }
  }

  function handleClick(btn) {
    const url = btn.getAttribute("data-clone-url");
    if (!url) return;

    const gitCmd = url.endsWith(".git")
      ? `git clone ${url}`
      : `git clone ${url}.git`;
    const baseLabel = btn.getAttribute("data-clone-label") || "Clone";
    const copiedLabel = btn.getAttribute("data-clone-copied") || "Copied!";

    copyToClipboard(gitCmd).then((success) => {
      if (success) {
        btn.textContent = copiedLabel;
        if (live)
          live.textContent = `Copied clone command for ${
            btn.getAttribute("aria-label") || "project"
          }`;
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = baseLabel;
          btn.disabled = false;
        }, 1800);
      } else {
        btn.textContent = "Failed";
        if (live)
          live.textContent = "Copy failed - please check browser permissions";
        setTimeout(() => {
          btn.textContent = baseLabel;
        }, 2200);
      }
    });
  }

  function init() {
    document.querySelectorAll(".clone-btn").forEach((btn) => {
      if (!btn._cloneBound) {
        btn._cloneBound = true;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          handleClick(btn);
        });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
