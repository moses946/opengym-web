# openGym Web

An installable, offline-first edition of [openGym](https://opengym.ch), maintained at [moses946/opengym-web](https://github.com/moses946/opengym-web).

## Use it

Open https://moses946.github.io/opengym-web/ in Chrome, Edge, or Safari.
Choose **Install app** on Home. On iPhone/iPad use Safari → Share → Add to Home Screen.
Wait for the first online load to complete before going offline.

- Start with a clean training log; no fictional demo history.
- Load a starter plan or build routines, schedule your week, and log guided workouts.
- Track sets, rests, personal records, body weight, measurements, and training statistics.
- Browse the exercise catalogue, instructions, muscle maps, and demonstrations.
- Export/import your log in Settings → Data & backup.
- Workouts and settings are stored on this device. There is no hosted account or cross-device sync in this edition. Clearing browser/site data removes the local copy; export backups regularly.
- AI coaching, server accounts, and server notifications require upstream self-hosting and are not enabled in this static edition.

## Develop

Requires Node.js 22.12+ and npm.

```sh
cd frontend
npm ci
npm run dev -- --mode production
npm test -- src/store/useStore.standalone.test.jsx src/store/persistence.test.js src/lib/sw-media.test.js
npm run build
cd ..
node scripts/fetch-web-media.mjs
node scripts/catalogue/stage-media.mjs frontend/dist
cd frontend
npm run preview
```

Production builds select local-only mode through `frontend/.env.production`. Use localhost or HTTPS for the service worker. All navigation uses hash routes and works under a subdirectory.

Pushes to main build, test, and deploy automatically through GitHub Pages. The `.openai/hosting.json` file identifies the separate private Sites deployment.

## Provenance and license

Based on DuarteSantos8/openGym commit `7c8290ca20cb619bf6baa6830ea864d283df305a` (v1.4.3). Copyright © 2026 Duarte Santos and contributors. Modifications: standalone browser mode, install flow, PWA icon, accessibility viewport, and deployment workflow. The web frontend, catalogue, and required shared coaching modules are included; native platform projects and the upstream server are omitted from this distribution.

Code remains **AGPL-3.0-or-later**; see LICENSE and NOTICE.md. This is a non-commercial fork. The build fetches the unmodified 180px exercise media under the non-commercial fork permission in NOTICE.md, not the AGPL. Retain the notices; obtain a Gym visual license before commercial use. See UPSTREAM_README.md for the original project documentation.
