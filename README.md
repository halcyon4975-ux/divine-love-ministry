# Divine Love Ministry — Website

A responsive, production-ready informational website built with **HTML5, CSS3, and vanilla JavaScript** only. No frameworks, no libraries.

## Structure

```
index.html        Home
about.html        About Us (history, founder, mission, vision, values, objectives)
programs.html     Programs (6 program sections with anchor links)
gallery.html      Gallery (category filters + lightbox)
volunteer.html    Volunteer registration form (front-end validation only)
donate.html       Donation landing page (Paystack placeholder)
contact.html      Contact form, details, map placeholder

css/base.css      Design tokens (CSS variables), reset, typography, buttons, utilities
css/layout.css    Header, navigation, footer, page hero
css/pages.css     Page-specific sections

js/main.js        Sticky header, mobile menu, reveal-on-scroll, stat counters
js/gallery.js     Gallery filtering + accessible lightbox
js/forms.js       Client-side form validation (no backend yet)

images/           Put your photographs here
```

## How to swap in your real photos

Every image slot already contains an on-brand SVG illustration from the `images/`
folder. To replace one with a photograph:

1. Copy your photo into `images/`.
2. Find the matching `<img>` tag (the `alt` text tells you which scene it is) and
   change its `src`, e.g.:

```html
<img src="images/anomabo-outreach.jpg"
     alt="Health screening for the people of Anomabo"
     loading="lazy">
```

3. Update the `alt` text to describe the real photo.
4. Keep `loading="lazy"` everywhere **except** the home hero image, which uses
   `fetchpriority="high"` so it loads first.

Photos look best at roughly these sizes: hero 1600×900+, program/gallery images
1000×750 (4:3), the founder portrait 900×1200 (3:4), and the four home-page
squares 700×700. Larger is fine — the CSS crops to fit (`object-fit: cover`).

Once your photos are in, you can delete any unused SVGs from `images/`.

## Other placeholders to fill in later

- Phone number, email, and full address (footer + contact page)
- Social media links (`href="#"` in footer + contact page)
- Google Maps embed (replace the `.map-placeholder` block on contact.html with your iframe)
- Real testimonials and partner logos (index.html)
- Impact statistics (index.html — update the `data-count-to` values)
- Paystack integration on donate.html when you're ready to accept online payments

## Forms

Both forms validate in the browser and show a success message, but nothing is sent anywhere yet (by design). When you have a backend or a form service, point the `<form>` at it and remove `data-validate`'s submit interception in `js/forms.js` if needed.
