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
  
  

  /* ---------- Event Details Modal ---------- */
  const eventModal = document.getElementById("event-modal");

  if (eventModal) {
    const modalImage = document.getElementById("modal-event-image");
    const modalTitle = document.getElementById("modal-event-title");
    const modalDesc = document.getElementById("modal-event-desc");
    const modalDate = document.getElementById("modal-event-date");
    const modalLocation = document.getElementById("modal-event-location");
    const modalInfo = document.getElementById("modal-event-info");
    const modalCta = document.getElementById("modal-event-cta");
    const closeButtons = eventModal.querySelectorAll("[data-modal-close]");

    let lastFocusedElement = null;

    const EVENTS_DATA = {
      "health-outreach": {
        title: "Health Outreach",
        image: "images/events/health-outreach.jpg",
        imageAlt: "Community members receiving health screening at a Divine Love Ministry outreach under a canopy",
        desc: "Providing health screening, education, and basic healthcare support to selected communities.",
        date: "To be announced",
        location: "To be announced",
        extra: "More details about this outreach will be announced by Divine Love Ministry.",
        ctaText: "Contact Us",
        ctaHref: "contact.html"
      },
      "nhis-renewal": {
        title: "Free NHIS Renewal",
        image: "images/events/nhis-renewal.jpg",
        imageAlt: "Divine Love Ministry team registering community members for NHIS renewal at a community hospital",
        desc: "Supporting residents in selected communities with free renewal of their National Health Insurance Scheme membership.",
        date: "To be announced",
        location: "To be announced",
        extra: "More details about this outreach will be announced by Divine Love Ministry.",
        ctaText: "Contact Us",
        ctaHref: "contact.html"
      },
      "donation-orphanage": {
        title: "Donation to Orphanages & the Aged",
        image: "images/events/donation-orphanage.jpg",
        imageAlt: "A Divine Love Ministry volunteer presenting essential items to an elderly woman in her community",
        desc: "Providing essential items and support to orphanages and elderly people in need.",
        date: "To be announced",
        location: "To be announced",
        extra: "More details about this outreach will be announced by Divine Love Ministry.",
        ctaText: "Contact Us",
        ctaHref: "contact.html"
      }
    };

    const openEventModal = (eventKey, triggerBtn) => {
      const data = EVENTS_DATA[eventKey];
      if (!data) return;

      lastFocusedElement = triggerBtn || document.activeElement;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalDate) modalDate.textContent = data.date;
      if (modalLocation) modalLocation.textContent = data.location;
      if (modalInfo) modalInfo.textContent = data.extra;
      if (modalImage) {
        modalImage.src = data.image;
        modalImage.alt = data.imageAlt || data.title;
      }
      if (modalCta) {
        modalCta.textContent = data.ctaText || "Contact Us";
        modalCta.href = data.ctaHref || "contact.html";
      }

      eventModal.classList.add("is-open");
      eventModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      const closeBtn = eventModal.querySelector(".modal__close");
      if (closeBtn) {
        closeBtn.focus();
      } else {
        eventModal.focus();
      }
    };

    const closeEventModal = () => {
      if (!eventModal.classList.contains("is-open")) return;
      eventModal.classList.remove("is-open");
      eventModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    // Open handlers for event buttons
    document.querySelectorAll(".event-card__btn, [data-event]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".event-card");
        let eventKey = btn.dataset.event;
        if (!eventKey && card && card.id) {
          eventKey = card.id.replace("event-", "");
        }
        if (eventKey && EVENTS_DATA[eventKey]) {
          openEventModal(eventKey, btn);
        }
      });
    });

    // Close handlers (close buttons & overlay)
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeEventModal();
      });
    });

    // Close on click outside dialog content
    eventModal.addEventListener("click", (e) => {
      if (e.target === eventModal || e.target.classList.contains("modal__overlay")) {
        closeEventModal();
      }
    });

    // Keyboard navigation (Escape to close, Tab to trap focus)
    document.addEventListener("keydown", (e) => {
      if (!eventModal.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeEventModal();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = eventModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );

        if (!focusable.length) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === eventModal) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
  /* ---------- Homepage Announcement Popup ---------- */
  const annPopup = document.getElementById('announcement-popup');
  const annPopupClose = document.getElementById('ann-popup-close');
  const annPopupOverlay = document.getElementById('ann-popup-overlay');
  const annPopupCta = document.getElementById('ann-popup-cta');
  const POPUP_SESSION_KEY = 'divineLoveEventPopupShown';

  if (annPopup) {
    const hasSeenPopup = sessionStorage.getItem(POPUP_SESSION_KEY);

    const closeAnnPopup = () => {
      annPopup.classList.remove('is-open');
      annPopup.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sessionStorage.setItem(POPUP_SESSION_KEY, 'true');
    };

    if (!hasSeenPopup) {
      // Small delay for better UX on load
      setTimeout(() => {
        annPopup.classList.add('is-open');
        annPopup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (annPopupClose) annPopupClose.focus();
      }, 500);
    }

    if (annPopupClose) {
      annPopupClose.addEventListener('click', closeAnnPopup);
    }

    if (annPopupOverlay) {
      annPopupOverlay.addEventListener('click', closeAnnPopup);
    }

    if (annPopupCta) {
      annPopupCta.addEventListener('click', (e) => {
        e.preventDefault();
        closeAnnPopup();
        const targetSection = document.getElementById('upcoming-events');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && annPopup.classList.contains('is-open')) {
        closeAnnPopup();
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


