# Campus Canteen Ordering

## Purpose

This starter application displays a simple campus canteen menu and local demo orders. It provides a small client-side codebase for an SDLC class exercise.

## Requirements

- A current Node.js LTS release
- npm

## Quick Start

```bash
npm install
npm run dev
```

Open the local address shown by Vite. Run `npm run build` to create a production build in `dist/`.

## What Works

- View six seeded menu items and select an item for details.
- See total and available menu item counts.
- Place a local demo order for an `AVAILABLE` item.
- View seeded and newly added orders with their status.
- See a disabled action and explanation for a `SOLD OUT` item.
- Reset all browser demo changes to the original seed data.

## Data & Reset

Static starter records come from `src/data/seed.js`. Changes are saved as JSON under `sdlc:case-b:v1` in this browser's `localStorage`. They are not shared with another browser or device and are not written back to Git. Use **Reset Demo Data** to restore a fresh copy of the seed data.

## Project Structure

- `src/App.jsx` owns the page state and connects the UI actions.
- `src/components/` contains the menu list, cards, details, order list, and status badge.
- `src/data/seed.js` contains deterministic demo records.
- `src/utils/orderUtils.js` contains small order checks, ID creation, and display helpers.
- `src/utils/storage.js` safely loads, saves, and resets local browser data.
- `src/styles.css` contains the responsive page styles.

## Collaboration Notes

Work from your group's own Sprint Backlog. Use a branch, make focused commits, open a pull request, and ask a peer to review it before merge. Keep the code change and review evidence connected to the backlog item selected by your group.

## Limitations

This is a client-side demonstration only. It has no backend, authentication, shared database, or cross-device synchronization. Browser data is for local practice and should not be used for sensitive or operational information.
