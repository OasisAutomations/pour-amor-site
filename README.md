# Pour Amor — Website

A one-page pitch/demo site for Pour Amor, a luxury mobile cocktail bar built from a
renovated horse trailer, serving weddings and private events across Riverside County
and the Inland Empire, CA.

Built as vanilla HTML/CSS/JS with GSAP + ScrollTrigger — no build step, no dependencies
beyond CDN-loaded fonts and GSAP.

See `../research/03-build-brief.md` for the design brief this was built from, and
`../research/01-client-brand.md` for what's confirmed real vs. placeholder.

## Run locally

```bash
cd site
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Before this goes live as the client's real site

Everything is functional and populated with real business facts (phone, Instagram,
cocktail menu, staff/rating stats), but several things are intentionally placeholder
and marked in the code with `REPLACE` comments or a visible "placeholder" badge:

- **Logo** — currently a text wordmark ("Pour Amor" in Playfair Display italic)
- **Trailer/event photography** — `#trailer` scroll section and `#gallery` grid are
  styled placeholders (gradient panels), ready to swap for real photos/video
- **Testimonials** — sample quotes, clearly tagged "Sample" — replace with real reviews
- **Booking form** — `action` attribute points at a placeholder Formspree endpoint
  (`REPLACE_WITH_FORM_ID` in `index.html`) — needs a real form ID or backend before launch
- **Pricing/packages** — not shown; no pricing was available in research, confirm with
  the client whether to add a packages section

## Deploy

Once approved, use this project's `Instant Publish Skill` (`../Instant Publish Skill _ Notion.pdf`)
to push to GitHub and deploy to Vercel.
