/* ============================================
   Divine Love Ministry — main.js
   Navigation, scroll effects, reveal animations
   ============================================ */

(() => {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector(".site-header");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    // Close when a link is chosen or when Escape is pressed
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Reset state when resizing up to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) closeMenu();
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length && "IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Count-up statistics ---------- */
  const stats = document.querySelectorAll("[data-count-to]");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.countSuffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (stats.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      stats.forEach((el) => {
        el.textContent =
          parseInt(el.dataset.countTo, 10).toLocaleString() +
          (el.dataset.countSuffix || "");
      });
    } else {
      const statObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      stats.forEach((el) => statObserver.observe(el));
    }
  }


const liveRegion = document.getElementById("copy-live-region");

    document.querySelectorAll(".copy-btn").forEach((btn) => {
      const originalLabel = btn.querySelector("span:last-child").textContent;

      btn.addEventListener("click", async () => {
        const value = btn.dataset.copyValue;
        if (!value) return;

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
          } else {
            const tempInput = document.createElement("textarea");
            tempInput.value = value;
            tempInput.style.position = "fixed";
            tempInput.style.opacity = "0";
            document.body.appendChild(tempInput);
            tempInput.focus();
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
          }

          const label = btn.querySelector("span:last-child");
          btn.classList.add("is-copied");
          label.textContent = "Copied!";
          if (liveRegion) liveRegion.textContent = "Copied to clipboard.";

          setTimeout(() => {
            btn.classList.remove("is-copied");
            label.textContent = originalLabel;
          }, 2000);
        } catch (err) {
          if (liveRegion) liveRegion.textContent = "Couldn't copy automatically — please copy it manually.";
        }
      });
    });
  
  

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


