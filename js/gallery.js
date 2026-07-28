/* ============================================
   Divine Love Ministry — gallery.js
   Category filtering + accessible lightbox
   ============================================ */

(() => {
  "use strict";

  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = Array.from(grid.querySelectorAll(".gallery-item"));

  /* ---------- Filtering ---------- */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter;

      filterButtons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );

      items.forEach((item) => {
        const match =
          category === "all" || item.dataset.category === category;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lbMedia = lightbox.querySelector(".lightbox__media");
  const lbCaption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav--next");

  let currentIndex = -1;
  let lastFocused = null;

  const visibleItems = () => items.filter((i) => !i.classList.contains("is-hidden"));

  const render = (index) => {
    const list = visibleItems();
    if (!list.length) return;
    currentIndex = (index + list.length) % list.length;
    const item = list[currentIndex];

    // Clone the item's media (image slot or real img) into the lightbox
    const media = item.querySelector(".img-slot, img");
    lbMedia.innerHTML = "";
    if (media) lbMedia.appendChild(media.cloneNode(true));

    const caption = item.querySelector("figcaption");
    lbCaption.textContent = caption ? caption.textContent.trim() : "";
  };

  const openLightbox = (item) => {
    lastFocused = document.activeElement;
    render(visibleItems().indexOf(item));
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  items.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => render(currentIndex - 1));
  nextBtn.addEventListener("click", () => render(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") render(currentIndex - 1);
    if (e.key === "ArrowRight") render(currentIndex + 1);
  });
})();
