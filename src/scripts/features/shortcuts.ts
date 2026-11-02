export function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "?" || e.ctrlKey || e.metaKey) return;
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? ""))
      return;
    const overlay = document.querySelector<HTMLElement>(
      ".achievements-overlay",
    );
    if (overlay && !overlay.classList.contains("open"))
      document.getElementById("achievements-toggle")?.click();
  });
}
