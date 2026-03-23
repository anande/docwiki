document.addEventListener("DOMContentLoaded", function () {
  // Create toggle button
  const btn = document.createElement("button");
  btn.className = "nav-toggle-btn";
  btn.title = "Toggle navigation";
  btn.setAttribute("aria-label", "Toggle navigation sidebar");
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
  </svg>`;

  document.body.appendChild(btn);

  // Restore saved state
  if (localStorage.getItem("nav-hidden") === "true") {
    document.body.classList.add("nav-hidden");
  }

  btn.addEventListener("click", function () {
    document.body.classList.toggle("nav-hidden");
    localStorage.setItem(
      "nav-hidden",
      document.body.classList.contains("nav-hidden")
    );
  });
});
