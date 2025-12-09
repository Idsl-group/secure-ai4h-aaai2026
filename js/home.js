document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".navbar__toggle");
  const links = document.querySelector(".navbar__links");

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("navbar__links--open");
  });
});
