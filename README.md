# hobbyBFF

“I’m excited to try this, and I feel good about going with you.”

hobbyBFF helps adults discover Boston-area classes, choose a compatible buddy through profiles and mutual interest, and make a plan together. This first version is an interactive v0 export with local demo state, adapted for mobile and desktop browsers.

## Run locally

Use Node 24 (see `.nvmrc`) and pnpm 11.19.0.

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. No API keys or database are required.

## Validate

```sh
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm exec playwright test
```

Browser tests run against a production server on port 3100, covering desktop and mobile discovery, saving, mutual matching, messaging, and the offline fallback. Build errors are enforced rather than suppressed.

## Demo flow

Search for pottery on Discover, choose “Find a buddy,” and express interest in Maya to trigger the simulated mutual match. Say hello, send a message, and suggest a session. Plans and profile edits are stored in this browser’s local storage; Profile includes a reset action.

All people, providers, prices, sessions, and availability are fictional. Messages do not reach real people, mutual matches are simulated, and booking controls do not reserve seats or process payments. Sample dates are fixed fixture data and may become past dates.

## Mobile and PWA

The responsive interface includes mobile bottom navigation and touch-friendly profile controls. A web manifest, 192/512px icons, Apple home-screen metadata, and a production service worker support installation where the browser allows it. On iOS, use Safari’s Share → Add to Home Screen. Use HTTPS in deployment (localhost works for development).

The service worker provides an offline reconnection page, not a fully offline application. It does not cache conversations or authenticated responses. This is a web/PWA prototype, not an App Store or Play Store binary.

## Structure

- `app/`: Next.js App Router entry, global styles, metadata, manifest
- `components/`: Discover, classes, buddies, matches, chat, plans, onboarding, and profile UI
- `lib/mock-data.ts`: sample classes and people
- `lib/store.tsx`: local demo state and persistence
- `lib/navigation.tsx`: in-app screen navigation
- `public/`: bundled photos, app icons, service worker, and offline page
- `tests/`: browser regression checks

## Next steps

Before real users: add authentication, server-authorized data access, actual mutual matching and messaging, moderation/reporting, and provider-backed class schedules. Current navigation uses in-memory screen state, so refreshing returns to Discover. Image assets are from the original v0 export; review provenance before commercial release.

## GitHub Pages deployment

The `Deploy GitHub Pages` workflow builds a static export and publishes `out/` on pushes to `main` or manual dispatch. Enable Pages with GitHub Actions as its source in repository Settings → Pages. Intended URL: https://lilly-liu.github.io/hobbyBFF/.

Run `GITHUB_PAGES=true pnpm build` to validate the export locally. This sets the `/hobbyBFF` base path for bundles, photos, manifest icons, and the service worker. Normal local development remains at `/`. GitHub Pages must be available for the repository's visibility and account plan.

## Origin

Initial UI generated with v0, then imported into this dedicated repository. The source ZIP, dependency folders, build output, and environment files are excluded from Git. The first PR establishes the functional prototype while keeping the exported visual identity.
