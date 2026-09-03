# Liquid Folio

My personal website + a template you can use. Next.js + Tailwind CSS, nothing else.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JonathanSeriesX/liquid-folio)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JonathanSeriesX/liquid-folio)

No environment variables are required, so either button lands a working site.
Or start locally:

```sh
pnpm install
pnpm dev
```

## Making it yours

Everything — every word, link, colour-coded accent and live number — lives in
[`site.config.tsx`](site.config.tsx). The components in `app/` read from it and
hardcode nothing, so that is usually the only file you touch. Replace my
content with yours and the design follows.

- **Scenes**: each tab lights the backdrop its own way — three soft lights
  and a wash, placed in `tabs[].scene`. The same three lights exist on every
  tab, so switching tabs sends them travelling to their new spots and colours.
- **Analytics** are off unless you set `NEXT_PUBLIC_CF_BEACON_TOKEN`
  (Cloudflare Web Analytics); no token, no script tag. See `.env.example`.
