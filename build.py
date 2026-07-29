#!/usr/bin/env python3
"""Assemble final HTML pages from partials (one-time build helper)."""
import pathlib

ROOT = pathlib.Path(__file__).parent
P = ROOT / "partials"

header = (P / "header.html").read_text(encoding="utf-8")
footer = (P / "footer.html").read_text(encoding="utf-8")

PAGES = {
    "index":     ("home",     "Divine Love Ministry — Empowering Communities, Enhancing Lives",
                  "Divine Love Ministry is a Ghanaian non-profit bringing free healthcare, NHIS registration, women's empowerment, and community support to rural communities in the Central Region.", []),
    "about":     ("about",    "About Us — Divine Love Ministry",
                  "Learn the story of Divine Love Ministry, founded in 2020 by Rev. Fr. Charles Bekpar to serve the aged, the sick, and the less privileged in Ghana's Central Region.", []),
    "programs":  ("programs", "Our Programs — Divine Love Ministry",
                  "Explore our programs: healthcare outreach, women's empowerment, community development, youth sports, elderly support, and orphanage donations.", []),
    "gallery":   ("gallery",  "Gallery — Divine Love Ministry",
                  "Photos from Divine Love Ministry's health outreaches, community events, youth sports, and donations across Ghana's Central Region.", ["gallery"]),
    "volunteer": ("volunteer","Volunteer — Divine Love Ministry",
                  "Register as a volunteer with Divine Love Ministry and help bring healthcare, hope, and dignity to rural communities in Ghana.", ["forms"]),
    "donate":    ("donate",   "Donate — Divine Love Ministry",
                  "Support Divine Love Ministry's work. Your donation funds health screenings, NHIS registrations, food for the elderly, and support for orphanages.", []),
    "contact":   ("contact",  "Contact — Divine Love Ministry",
                  "Get in touch with Divine Love Ministry for questions, partnerships, donations, or volunteering.", ["forms"]),
}

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#5b2d8e">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/pages.css">
</head>
<body>
{header}
{body}
{footer}{scripts}
</body>
</html>
"""

for slug, (page_key, title, description, extra_js) in PAGES.items():
    body = (P / f"page-{slug}.html").read_text(encoding="utf-8")

    # Mark the current page in the nav
    page_header = header.replace(
        f'data-page="{page_key}"',
        f'data-page="{page_key}" aria-current="page"',
    )

    scripts = "".join(
        f'\n<script src="js/{name}.js" defer></script>' for name in extra_js
    )

    html = TEMPLATE.format(
        title=title,
        description=description,
        header=page_header,
        body=body,
        footer=footer,
        scripts=scripts,
    )

    (ROOT / f"{slug}.html").write_text(html, encoding="utf-8")
    print(f"built {slug}.html")
