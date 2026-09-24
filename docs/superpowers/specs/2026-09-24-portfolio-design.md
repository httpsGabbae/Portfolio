# Portfolio Rebuild — Design Spec (2026-09-24)

## Goal
Single-page static portfolio for John Aldrin Doruca (Gabbae), 2nd-year BSCS Lipa City Colleges.
Host: GitHub Pages. Files: `index.html`, `style.css`, `script.js`. No build step.

## User data (locked)
- Name: John Aldrin Doruca / Gabbae, Lipa City PH
- Title: Aspiring Full Stack Developer
- Email: j.doruca109@gmail.com
- Achievement: 3rd placer, department hackathon
- Photo: `assets/img/profile.jpg` (user provides; onerror fallback to initials avatar)
- Socials: GitHub https://github.com/httpsGabbae, LinkedIn https://www.linkedin.com/in/johnaldrindoruca, Messenger https://m.me/johnaldrindoruca
- Chatbot (verbatim):
  1. "What is your stack?" → "PHP, Front End, I excel in Github and Supabase. Mostly Full Stack."
  2. "How much is your rate?" → "Send me a message and lets talk about it!" + scroll to #contact
  3. "Who are you?" → "I am John Aldrin Doruca, a student at Lipa City Colleges studying computer science and aspiring as part of cybersecurity and full stack developer."

## Design system — Vercel DESIGN.md exact (light default)
- colors: primary #171717, on-primary #ffffff, ink #171717, body #4d4d4d, mute #888888, hairline #ebebeb, canvas #ffffff, canvas-soft #fafafa, canvas-soft-2 #f5f5f5, link #0070f3, link-deep #0761d1, link-bg-soft #d3e5ff
- dark (`[data-theme=dark]`): canvas #0a0a0a, canvas-soft #111111, canvas-soft-2 #1a1a1a, ink #ededed, body #a1a1a1, mute #888888, hairline #262626, primary #ededed (pill inverts), on-primary #0a0a0a, link #3291ff
- typography: Inter/system-ui 600 display (48px/-2.4, 32px/-1.28, 24px/-0.96), body 16/14; JetBrains Mono 12-13px eyebrows/code only
- rounded: pill 100px (marketing CTA), sm 6px (inputs/nav), md 8px (cards), lg 12px
- spacing: 4px base; section 96px desktop / 64px mobile; max-width 1080px, gutters 24/16px
- No gradients except subtle hero mesh (blue #007cf0 → teal #00dfd8 / violet #7928ca → pink #ff0080) at hero scale only, low opacity. No heavy shadows — stacked subtle + hairline ring.

## Architecture
- `index.html`: nav + 7 bands (home/about/skills/projects/chatbot/contact/footer) + chatbot panel + back-to-top. Meta: viewport-fit=cover, theme-color x2, color-scheme light dark.
- `style.css`: CSS vars light + [data-theme=dark] override; mobile-native baseline; 3-up→2-up→1-up grid; transform+opacity reveals only.
- `script.js`: vanilla, no deps. Theme toggle (localStorage gabbae-theme, prefers-color-scheme default), chatbot keyword match, contact demo send + draft, reveal IntersectionObserver, skill bars, nav active, back-to-top.

## Sections → school requirements
1. Home (#home): name, title, intro, CTA View work + GitHub, profile pic with fallback.
2. About (#about): description, education BSCS LCC 2nd year, hackathon 3rd, cybersecurity+fullstack goal, stats.
3. Skills (#skills): PHP, HTML/CSS/JS Frontend, GitHub, Supabase, MySQL, Laravel basics (6 ≥ 5 required).
4. Projects (#projects): 3 non-repeating + 1 bonus (Final LCC Payroll / FitnessHub / LMS-Code-Compiler / LearnEngageWebsite), each title+desc+tags+link.
5. Theme toggle in nav (sun/moon, aria-pressed, persists).
6. Ask About Me (#ask): 3 preset buttons + free input, keyword matching (stack/rate/who + fallback), rate answer scrolls to contact.
7. Contact (#contact): email row + copy btn, form name/email/message (validation, demo send), GitHub/LinkedIn/Messenger cards.
8. Responsive: <960px 2-col→1-col stack, <640px hamburger, 44px targets, 16px inputs.

## Mobile-native baseline (applied)
tap-highlight transparent, hover gated, 100svh hero / 100dvh shell, touch-action manipulation, overscroll none/contain, safe-area padding, text-size-adjust 100%, user-scalable never disabled.

## Animation (web, not animate-expo)
animate-expo is React Native — N/A. Web: CSS 180-200ms ease-out reveals (translateY 12px + fade), pills stagger via IO, skill bars scaleX. prefers-reduced-motion disables. No layout-animating props.

## Testing
- Desktop 1280 + mobile 390 (DevTools + real phone if possible)
- Toggle light/dark persists + theme-color updates
- Chatbot: click each preset + type "stack", "rate/magkano/price", "who are you", gibberish fallback
- Form: empty/invalid blocks, valid shows success, mailto fallback
- Images: missing profile.jpg shows initials, no broken icon

## Self-review
No TBDs. No contradictions (light-first Vercel + dark inversion defined). Single-plan scope. Rate Q explicitly scrolls to contact per user spec.

## As-built amendments (post-spec evolution)
- Theme flipped to dark-first tech/cyan system (Space Grotesk display, cyan `#22d3ee` accents) per later direction; light theme kept via `[data-theme="light"]`.
- Projects use vertical rows + stack-icon badges; `#ask` section removed (FAB-only chatbot).
- Profile glare-follow + tilt added (fine pointers only).
- Mouse-follow scene (grid + spot + blobs) + custom cursor added, driven by anime.js v4.5.0 UMD (`animate`, `stagger`, `outExpo` — global + API verified against the shipped bundle) with rAF lerp for ambient layers; static fallbacks when CDN blocked, touch, or reduced-motion.
- ui-ux-pro-max-skill Portfolio rules applied: SVG-only icons, pointer cursors on clickables, visible focus, reduced-motion support, reflow-safe pills, 375/768/1024/1440 responsive.
