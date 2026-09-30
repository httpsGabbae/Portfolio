# Portfolio Yanz-Inspired Retrofit — Design Spec
Date: 2026-09-30 | Status: approved in chat (Approach A retrofit)

## 1. Goal
Rebuild the *effects and system* of yanzcruz.com with original content/assets for John Aldrin Doruca (Gabbae). No copying of Yanz text, images, fonts, or branding.

User decisions:
- Scope: Inspired redesign (keep name, projects, skills, contact, chatbot)
- Gate: Keep ENTER THE PORTFOLIO gate, remove sound
- Palette: Keep cyan theme (navy #05070b + cyan #22d3ee), not Yanz cream/red

## 2. Architecture
Retrofit in place. No new deps, no framework. Keep vanilla + anime.js CDN + existing theme/chatbot.
- `index.html`: add gate overlay, marquee, numbered section heads, sticker layer, testimonial slider markup, big CTA
- `style.css`: add gate, display type, marquee keyframes, sticker parallax, slider, counters, magnetic buttons (~300 lines, CSS-only where possible)
- `script.js`: gate controller, marquee pause, reveal, parallax rAF, counters, slider, magnetic (guarded by reduced-motion + hover/pointer checks)
- No external images/audio/fonts. Stickers = CSS shapes/badges. Fonts stay Inter/Space Grotesk/JetBrains Mono.

## 3. Components
1. **Enter gate `#enterGate`**: fullscreen, brand + ENTER button, Enter key support, `sessionStorage gabbae-entered`, auto-skip if reduced-motion. Focus trap-lite: focus button on show, restore on dismiss.
2. **Hero**: display h1 clamp(48px,8vw,88px) tight leading, `AVAILABLE FOR PROJECTS` pill with pulse dot, meta row `LIPA CITY PH / WORKING WORLDWIDE`, `SCROLL FOR MORE ↓`, View work / Contact CTAs, sticker badges (e.g. rotating `OPEN TO WORK •` disc, `PHP • MYSQL •` chip) with rAF parallax.
3. **Numbered sections**: 01 Projects / 02 Behind the work (About) / 03 What I do (Skills) / 04 How I work (new: Diagnose→Map→Design→Build→Connect→Launch adapted to student workflow) / 05 Results (Achievements → slider + stats).
4. **Marquee**: infinite CSS translateX loop, duplicated aria-hidden track, pause on hover/focus, `PHP 8.x • MYSQL • SUPABASE • LARAVEL BASICS • AVAILABLE WORLDWIDE`.
5. **Project rows**: keep `.prow` cards, add hover lift + thumb zoom, arrow CTA. No layout break.
6. **Results slider**: reuse achievement cards as slides, prev/next buttons, `← 01 / 03 →` counter, keyboard arrows, swipe (touch events), dots optional.
7. **Counters**: `data-target` count-up on intersect (already exists for stats — extend to Results stats: projects, systems shipped, hackathon place).
8. **Big CTA + footer**: `GOT A SYSTEM WORTH SHIPPING? LET'S BUILD IT.` + Work-with-me mailto button + marquee mini-strip. Footer keeps GitHub/Contact/Back-to-top.
9. **Motion**: keep existing cursor/scene-grid/reveal; add magnetic buttons (translate ≤6px), parallax stickers lerp rAF. All gated by `prefers-reduced-motion` and `(hover:hover) and (pointer:fine)`.

## 4. Data flow
Static only. No backend. Gate state in sessionStorage. Slider index in memory. Counters via IntersectionObserver. Contact form mailto fallback unchanged. Chatbot unchanged.

## 5. Error handling / edge cases
- No JS: gate hidden via `<noscript>` style, content fully visible.
- anime.js CDN fail: guard `window.anime`, fallback to CSS reveals.
- sessionStorage throw (private mode): try/catch, gate shows each load (acceptable).
- Mobile 360px: gate fits, marquee slows, stickers hidden or static, slider swipe works, coarse-pointer disables parallax/magnetic/cursor.
- Keyboard: gate dismissible via Enter/Escape, slider arrows focusable, focus-visible outlines.

## 6. A11y / mobile (mobile-native skill)
- Gate `role=dialog aria-modal`, slider `aria-roledescription=carousel`, marquee `aria-hidden` duplicate.
- Contrast: cyan on navy checked, light theme vars preserved.
- Touch targets ≥44px. `interactive-widget=resizes-content` already set.

## 7. Design skills to apply in implementation
- apple-design: spring easing, interruptible transforms
- emil-design-eng: hover polish, hierarchy, spacing
- mobile-native: tap targets, 100vh→100svh, pull-refresh safe
- animation-vocabulary: Pop in, Marquee, Count-up, Parallax, Magnetic (correct terms)

## 8. Testing
- Open `index.html` locally / simple server; click ENTER, reload (remembered), Escape/Enter keys
- Scroll each numbered section, hover cards, run slider prev/next + swipe
- Toggle light/dark, open chatbot, submit contact (mailto)
- DevTools 360x740 + `prefers-reduced-motion: reduce` emulate
- No console errors; `git diff --stat` only touches 3 files + spec

## 9. Out of scope
Copying Yanz copy/images/fonts/audio; adding backend; changing chatbot answers; removing theme toggle; adding sound.
