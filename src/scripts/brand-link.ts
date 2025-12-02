/**
 * Brand link handler - prevents unnecessary page reload when already on home
 */

const brandLink = document.querySelector(".brand-link") as HTMLAnchorElement;

if (brandLink) {
  brandLink.addEventListener("click", (e) => {
    const currentPath = window.location.pathname;
    // If we're already on the home page, prevent navigation
    if (currentPath === "/" || currentPath === "") {
      e.preventDefault();
      // Optionally scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}
