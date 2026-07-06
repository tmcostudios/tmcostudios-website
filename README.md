# TM & Co. Studios

A 3-page marketing-studio website built with **React + Vite**, **Framer Motion** for UI motion, and **react-three-fiber / three.js** for real interactive 3D.

Pages: **Home** (`/`), **Work** (`/work`), **Expertise** (`/expertise`).

## Run it

```bash
npm install
npm run dev      # local dev server (Vite prints the URL, usually http://localhost:5173)
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

Requires Node 18+ (built and tested on Node 22).

## What's where

```
src/
  data/content.js          ← ALL copy lives here. Edit text in one place.
  App.jsx                  ← routing, page transitions, scroll progress bar
  components/
    Navbar.jsx  Footer.jsx  Logo.jsx
    Reveal.jsx             ← scroll-reveal wrapper (Framer Motion)
    MagneticButton.jsx     ← cursor-attracted CTA
    Marquee.jsx            ← infinite scrolling text bands
    three/
      HeroScene.jsx        ← 3D hero object (home page)
      OrbField.jsx         ← 3D orb cluster (work page)
    sections/
      home/     work/     expertise/
  pages/  Home.jsx  Work.jsx  Expertise.jsx
```

## Design tokens

Defined in `tailwind.config.js`:

| Token | Hex | Use |
|-------|-----|-----|
| `ink` | `#1A1A18` | base background |
| `lime` | `#AEEE2D` | primary accent |
| `olive` | `#515E1B` | green panels |
| `paper` | `#F4F4F0` | text |

Fonts: **Space Grotesk** (headlines/body) + **Caveat** (handwritten script), loaded in `index.html`.

## Swapping in real images

The service/project cards currently use brand-gradient fills as photo stand-ins.
Drop your art into `public/` and replace the gradient `<div>`/`<article>` background
classes with an `<img className="absolute inset-0 h-full w-full object-cover" />`
inside the card. Look for the `cardArt` / `projectArt` arrays.

## Notes

- All animation respects `prefers-reduced-motion`.
- The 3D scenes are lazy-loaded so first paint stays fast.
- Routing uses `BrowserRouter`; if you deploy to a static host, add a catch-all
  rewrite to `index.html` (Vercel/Netlify do this automatically for SPAs).
