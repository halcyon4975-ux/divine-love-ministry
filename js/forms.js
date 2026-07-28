/* ============================================
   Divine Love Ministry – forms.js
   Client-side validation + Formspree submission
   ============================================ */

(() => {
  "use strict";

  const forms = document.querySelectorAll("form[data-validate]");
  if (!forms.length) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\-\s\d]{7,20}$/;

  const setError = (field, hasError) => {
    const wrapper = field.closest(".form-field");
    if (!wrapper) return;
    wrapper.classList.toggle("has-error", hasError);
    field.setAttribute("aria-invalid", String(hasError));
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let valid = true;

    if (field.required && !value) valid = false;
    else if (value && field.type === "email" && !emailPattern.test(value)) valid = false;
    else if (value && field.type === "tel" && !phonePattern.test(value)) valid = false;

    setError(field, !valid);
    return valid;
  };

  forms.forEach((form) => {
    const fields = form.querySelectorAll("input:not([type='hidden']), select, textarea");
    const success = form.parentElement.querySelector(".form-success");
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.textContent : "";

    // Live validation on blur and input
    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".form-field")?.classList.contains("has-error")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // --- Client-side validation ---
      let allValid = true;
      let firstInvalid = null;

      fields.forEach((field) => {
        const ok = validateField(field);
        if (!ok && !firstInvalid) firstInvalid = field;
        allValid = allValid && ok;
      });

      if (!allValid) {
        firstInvalid?.focus();
        return;
      }

      // --- Determine Formspree endpoint ---
      const action = form.getAttribute("action");
      if (!action) {
        // Fallback: no endpoint configured, just show success
        form.reset();
        if (success) {
          success.classList.add("is-visible");
          success.focus?.();
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // --- Submit to Formspree via fetch ---
      const formData = new FormData(form);

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        const response = await fetch(action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          // Success
          form.reset();
          if (success) {
            success.classList.add("is-visible");
            success.focus?.();
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          // Hide the form after success (optional – keeps the page clean)
          form.style.display = "none";
        } else {
          // Formspree returned an error
          const data = await response.json().catch(() => ({}));
          const errors = data.errors
            ? data.errors.map((err) => err.message).join(", ")
            : "Something went wrong. Please try again.";
          alert(errors);
        }
      } catch (err) {
        // Network error
        alert("Network error – please check your connection and try again.");
      } finally {
        // Restore button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
})();
