# NexoSites

> A fast, static web agency site — no frameworks, no build step. Pure HTML, CSS & vanilla JS.

**Live site:** [nexosites.xyz](https://nexosites.xyz)  
**Hosting:** Cloudflare Pages (auto-deploys from GitHub `main`)

---

## Project Structure

```
Nexosites-main/
├── index.html              # Homepage
├── style.css               # Global styles & design tokens
├── main.js                 # Scroll reveal, tilt, loader, navbar
├── nav-footer.js           # Shared nav & footer (injected into every page)
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # XML sitemap for SEO
├── site.webmanifest        # PWA manifest
├── _headers                # Cloudflare Pages security & cache headers
├── _redirects              # Cloudflare Pages redirect rules
├── CNAME                   # Custom domain config
├── assets/
│   ├── banner.png          # OG / social share image (1200×630)
│   ├── icons/              # favicon.svg, logo.png
│   ├── css/app.css         # Auth/dashboard/quote/chat/admin component styles
│   ├── js/supabase-client.js, auth.js  # Shared Supabase client + session helpers
│   └── portfolio/          # SVG portfolio thumbnails
└── pages/
    ├── home.css            # Homepage-specific styles
    ├── home.js             # Counter animation
    ├── inner.css           # Shared inner-page styles
    ├── about/              # About page
    ├── contact/            # Contact page + contact.js (general inquiries)
    ├── faq/                # FAQ page + faq.js
    ├── portfolio/          # Portfolio page + portfolio.css + portfolio.js
    ├── services/           # Services page
    ├── login/              # Client login
    ├── signup/             # Client signup
    ├── quote/              # Dynamic quote calculator (the only pricing now — no fixed tiers)
    ├── dashboard/          # Customer dashboard (their orders)
    ├── messages/           # Customer ↔ you realtime chat
    └── admin/              # Your admin panel (orders + all customer chats)
```

---

## Design System — "Blueprint / Drafting Table"

The site's visual theme: technical drawing sheets, not another dark-gradient SaaS look.
Deep blueprint-navy panels, cyan linework, an amber "stamp" accent, dimension-line
dividers instead of plain hairlines, sharp corners with small registration marks on
cards, and a self-drawing SVG wireframe in the homepage hero (the "we draft your site"
moment).

All colors/fonts are CSS variables in `style.css` `:root` — change a value there and it
cascades everywhere (including `assets/css/app.css`, which powers the auth/dashboard/
quote/chat/admin pages):

| Variable | Role |
|---|---|
| `--purple-l` | Primary accent — line cyan |
| `--pink` | Secondary accent — stamp amber |
| `--panel` / `--dark-2` | Card & panel background |
| `--text` / `--text-2` / `--text-3` | Body / muted / faint text |
| `--ff-h` | Display font (Space Grotesk) |
| `--ff-b` | Body font (IBM Plex Sans) |
| `--ff-m` | Monospace/label font (IBM Plex Mono) |
| `--radius` | Corner radius used across cards/buttons (kept small — 2–3px) |

`--ff-mono`/`--ff-display`/`--ff-body`/`--violet`/`--fast`/`--mid` are aliases kept
for `pages/inner.css` and `pages/portfolio/portfolio.css`, which still reference the
older naming — don't remove them unless those files are updated too.

---

## 🆕 Client Platform (Auth, Orders, Realtime Chat)

The site is now a full client platform on top of the marketing pages, powered by
**Supabase** (free tier: Postgres + Auth + Realtime). Project name: **"Nexo Sites"**.

### How it fits together
- `assets/js/supabase-client.js` — the shared Supabase client (URL + anon key already filled in).
- `assets/js/auth.js` — session helpers (`Auth.getSession()`, `Auth.getProfile()`, `Auth.requireAuth()`, `Auth.requireAdmin()`, `Auth.signOut()`).
- `nav-footer.js` — nav now swaps Login/Signup for Dashboard/Messages/Logout automatically based on session, with a live unread-message badge.
- `supabase/schema.sql` — full DB schema reference (already applied to the live project). Re-run only against a *fresh* Supabase project.

### Database tables
| Table | Purpose |
|---|---|
| `profiles` | One row per signed-up user (auto-created on signup via trigger). `role` is `customer` or `admin`. |
| `orders` | Quote requests / projects — project type, size, features, price, status. |
| `messages` | Realtime chat, one thread per customer (`customer_id`), sender can be the customer or you. |

Row Level Security is on for all three tables — customers only ever see their own rows, you (as `admin`) see everything.

### Making yourself the admin
1. Sign up for an account on the live site like any customer would.
2. In the Supabase dashboard → SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Log out and back in — you'll be redirected to `/pages/admin/` instead of the customer dashboard.

### Dynamic pricing (quote calculator)
`pages/quote/quote.js` replaces fixed pricing tiers with a live calculator: project type,
business size, page count, feature add-ons, timeline, and a maintenance plan all adjust
the price in real time. Submitting it requires an account (visitors are sent to sign up
first, and their in-progress quote is restored automatically after). It writes a row to
`orders` with `status = 'pending_review'` — you then review it in `/pages/admin/` and set
the real `final_price` and status.

**Editing prices/features:** open `pages/quote/quote.js` and edit the `PROJECT_TYPES`,
`BUSINESS_SIZES`, `FEATURES`, `TIMELINES`, or `MAINTENANCE` arrays at the top of the file.

### Messaging
Realtime via Supabase (`postgres_changes` subscriptions) — no polling. Customers get one
thread with you at `/pages/messages/`; you see every customer's thread in the "Messages"
tab of `/pages/admin/`, with unread indicators.

### What's intentionally NOT built (still manual, still free)
- **Payments** — no processor is wired up. Recommended flow: quote the customer in chat,
  send them a PayPal.me or bank transfer link manually once they accept. Wiring up real
  checkout (e.g. Stripe) would need a paid-ish setup or serverless functions — worth doing
  later if volume justifies it.
- **Email notifications** — customers/you won't get an email when a new message arrives;
  you'll see it next time you open the dashboard. Supabase Edge Functions + Resend (free
  tier) could add this later.

---

## Pricing is quote-only now

There is no fixed-price page anymore — `pricing.js` (the old IP-geolocation currency
converter) and `/pages/pricing/` were both removed. The quote calculator
(`pages/quote/quote.js`) is the only place prices are shown, and it's per-project rather
than tiered. See "Dynamic pricing (quote calculator)" above for how to edit it.

---

## Local Development

No build tools required. Just open files in a browser or run a local server:

```bash
# Python (built-in)
python3 -m http.server 3000

# Node.js (npx)
npx serve .

# VS Code: install "Live Server" extension, right-click index.html → Open with Live Server
```

Visit `http://localhost:3000`.

---

## Deployment (Cloudflare Pages)

1. Push changes to the `main` branch on GitHub.
2. Cloudflare Pages auto-deploys within ~30 seconds.
3. No build command or output directory needed — the repo root **is** the site.

**Settings in Cloudflare Pages dashboard:**
- Build command: *(none / leave blank)*
- Build output directory: `/` or leave blank
- Root directory: `/`

---

## Adding a New Page

1. Create `pages/yourpage/index.html` (copy an existing inner page as a template).
2. Include in `<head>`:
   ```html
   <link rel="stylesheet" href="../../style.css"/>
   <link rel="stylesheet" href="../inner.css"/>
   ```
3. Add to the nav in `nav-footer.js` (both desktop and mobile menu).
4. Add a `<url>` entry to `sitemap.xml`.
5. Update `robots.txt` if needed.

---

## SEO Checklist

Every page already has:
- ✅ Unique `<title>` and `<meta name="description">`
- ✅ Open Graph tags (`og:title`, `og:image`, `og:url`)
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ `robots.txt` and `sitemap.xml`
- ✅ Structured data (JSON-LD) on homepage
- ✅ `loading="lazy"` on all images
- ✅ `alt` text on all images
- ✅ Semantic HTML (`<main>`, `<nav>`, `<section>`, headings hierarchy)
- ✅ Fast load — no frameworks, assets cached via Cloudflare

**Still to do (see SEO guide below):**
- [ ] Submit sitemap to Google Search Console
- [ ] Claim Google Business Profile
- [ ] Build backlinks (directories, guest posts)

---

## Updating the Sitemap

When you add or update pages, update `sitemap.xml`:
```xml
<url>
  <loc>https://nexosites.xyz/pages/yourpage/</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```
Then ping Google: `https://www.google.com/ping?sitemap=https://nexosites.xyz/sitemap.xml`

---

## Contact

- **Email:** griesel050@gmail.com  
- **WhatsApp:** +27 81 613 7187
