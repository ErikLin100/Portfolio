# Portfolio — horizontal carousel

Single-page Vite + React portfolio. Each section is a full-viewport horizontal slide (intro → projects → contact).

## Quick start

```bash
npm install
npm run dev
```

Build for static hosting (Vercel, Netlify, GitHub Pages, etc.):

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Edit your content

All copy and image paths live in [`src/data.js`](src/data.js):

- `profile` — name, role, bio, history, photo, stack
- `projects` — one object per project slide
- `contact` — email, GitHub, LinkedIn, CTA

Replace placeholder images in `public/`:

- `public/me.svg` (or swap to `/me.jpg` and update `profile.photo`)
- `public/projects/project-1.svg` … `project-3.svg`

## Controls

- Mouse wheel / trackpad (vertical maps to horizontal)
- ← → arrow keys (also Home / End)
- On-screen prev / next buttons
- Bottom nav dots (Intro / Project N / Contact)
- Swipe left / right on touch devices

`prefers-reduced-motion` disables slide transitions.

## Structure

```
my-portfolio/
  public/
    me.svg
    projects/
  src/
    main.jsx
    App.jsx
    index.css
    data.js
    components/
      Carousel.jsx
      Slide.jsx
      IntroSlide.jsx
      ProjectSlide.jsx
      ContactSlide.jsx
      StackPills.jsx
      NavDots.jsx
```
