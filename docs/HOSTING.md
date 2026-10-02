# Hosting, domain and security

How DONE WELL moves from GitHub Pages to its own domain on Cloudflare Pages,
and the security switches that go with it. Do the parts in order: each one
relies on the one before.

Why Cloudflare Pages: it is free for commercial use, it sends the security
headers in `public/_headers`, and the same account provides the sign-in CAPTCHA
(Turnstile). GitHub Pages cannot send headers and stops serving a private
repository on the free plan. Vercel's free Hobby plan is for non-commercial use
only.

## 1. Register the domain

1. Choose the name, for example `donewell.co.za`.
2. Register it at a South African registrar, such as Domains.co.za, Afrihost or
   xneelo. A `.co.za` costs about R100–R150 a year. Register it in the
   business's name and use an email address you will always have.
3. Turn on two-factor sign-in at the registrar. Whoever controls the domain
   controls the site.

## 2. Put the domain on Cloudflare

1. Create a free account at cloudflare.com.
2. Choose **Add a domain**, enter the domain and pick the **Free** plan.
3. Cloudflare shows two nameservers, such as `ada.ns.cloudflare.com`.
4. At the registrar, open the domain's **Nameservers** setting, replace the
   registrar's nameservers with Cloudflare's two, and save.
5. Wait until Cloudflare emails you that the domain is active. This usually
   takes under an hour and can take up to a day.

## 3. Create the Cloudflare Pages project

1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorise GitHub and choose this repository.
3. Use these build settings:
   - Production branch: `main`
   - Build command: `npm run content:upload && npm run build && npm run verify:bundle`
   - Build output directory: `dist`
4. Under **Environment variables (Production)**, add:

   | Name | Value | Encrypt? |
   |---|---|---|
   | `NODE_VERSION` | `22` | no |
   | `VITE_SUPABASE_URL` | the project URL (Supabase → Project Settings → API) | no |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | the publishable key | no |
   | `VITE_SUPABASE_REGION` | e.g. `af-south-1` | no |
   | `VITE_TURNSTILE_SITE_KEY` | from step 6 (add it later) | no |
   | `SUPABASE_URL` | the same project URL | no |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role / secret key | **yes** |

   The service-role key only uploads the question bank during the build. Vite
   gives the website only `VITE_` variables, so this key never reaches a
   browser. Never rename it to start with `VITE_`.
5. Go to **Settings → Builds & deployments → Preview branch control** and set it
   to **None**. A preview build of an unmerged branch would otherwise upload
   its unfinished question bank to the live site.
6. Click **Save and Deploy**. The site appears at `<project>.pages.dev`.
7. Open that address and check the following:
   - Sign in works.
   - Practise shows the full bank, not the sample notice.
   - The demo still works.

## 4. Point the domain at the site

1. In the Pages project, go to **Custom domains → Set up a custom domain** and
   add `donewell.co.za`.
2. Add `www.donewell.co.za` as well.
3. Cloudflare creates the DNS records and the HTTPS certificate itself.

## 5. Tell Supabase about the new address

1. In Supabase, go to **Authentication → URL Configuration**.
2. Set **Site URL** to `https://donewell.co.za`.
3. Under **Redirect URLs**, add `https://donewell.co.za/**`. Keep the old
   GitHub Pages address until step 7.

Sign-in links and password emails now return to the new domain.

## 6. Switch on the sign-in CAPTCHA

1. In Cloudflare, go to **Turnstile → Add widget**.
2. Set the hostnames to `donewell.co.za`. Add `alhaji66.github.io` too while the
   old site is still in use.
3. Set the mode to **Managed** and create the widget.
4. Copy the **Site key** to these two places:
   - Cloudflare Pages: environment variable `VITE_TURNSTILE_SITE_KEY`. Then
     redeploy.
   - GitHub: **Settings → Secrets and variables → Actions → Variables**, a
     repository variable named `TURNSTILE_SITE_KEY`. This is only needed while
     GitHub Pages is still deploying.
5. Open the sign-in page and check that the Turnstile box shows a tick.
6. Only then, in Supabase, go to **Authentication → Attack Protection → Enable
   CAPTCHA protection**, choose **Turnstile**, and paste the **Secret key**.

Keep this order. If Supabase asks for a CAPTCHA before the site shows one,
nobody can sign in.

## 7. Make the repository private

Only do this after the new domain works. On the free plan, GitHub Pages stops
the moment the repository becomes private.

1. In GitHub, go to **Settings → General → Danger Zone → Change repository
   visibility → Make private**.
2. Go to **Settings → Pages** and unpublish the old site.
3. Remove `.github/workflows/deploy-pages.yml` (ask for a PR).
4. In Cloudflare, check under **Settings → Builds** that Pages can still see the
   repository. If not, go to GitHub **Settings → Applications → Cloudflare
   Workers and Pages → Configure** and give it access to this repository.
5. In Supabase, remove the old GitHub Pages address from the Redirect URLs.
6. In Turnstile, remove the old hostname.

Making the repository private stops new copies being made. Copies that people
already made while it was public cannot be recalled.

## 8. Lock the accounts

Turn on two-factor sign-in, preferably with an authenticator app, on every
account that can change the site:

- **GitHub:** Settings → Password and authentication.
- **Cloudflare:** My Profile → Authentication.
- **Supabase:** Account → Security.
- **The domain registrar.**

Keep the recovery codes somewhere safe and offline.

## What protects what

| Threat | Protection |
|---|---|
| Copying the whole question bank | The bank is only in private storage, readable after sign-in (STEP 36, `npm run verify:bundle`). |
| Schools sharing one login | Seat limits and learner approval (STEP 34), and device limits (STEP 35). |
| Password guessing and fake sign-ups | Turnstile CAPTCHA (`src/components/auth/Captcha.tsx`). |
| Injected script, clickjacking | Content-Security-Policy and the other headers in `public/_headers`, checked by `npm run check:security-headers`. |
| Reading other schools' data | Row Level Security on every table (`npm run test:rls`). |
