# Campus Equipment Access & Borrowing

## Purpose

This starter application displays simple campus equipment records and local demo requests. It provides a small client-side codebase for an SDLC class exercise.

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

- View six seeded equipment records and select equipment for details.
- Admins can add individual equipment units and mark or clear maintenance for each unit.
- Available and maintenance unit counts are shown separately; units under maintenance are unavailable for new demo requests.
- See total equipment records and how many currently show available units.
- Create a local demo request when the selected equipment has available units and is not under maintenance.
- View seeded and newly added requests with their status.
- See a disabled action when the selected equipment has no available units.
- Reset all browser demo changes to the original seed data.

## Data & Reset

Static starter records come from `src/data/seed.js`. Changes, including units and their maintenance markers, are saved as JSON under `sdlc:case-d:v1` in this browser's `localStorage`. Existing demo data using the previous per-equipment maintenance format is migrated when loaded. Data is not shared with another browser or device and is not written back to Git. Use **Reset Demo Data** to restore a fresh copy of the seed data.

## Project Structure

- `src/App.jsx` owns the page state and connects the UI actions.
- `src/components/` contains the equipment list, cards, details, request list, and status badge.
- `src/data/seed.js` contains deterministic demo records.
- `src/utils/equipmentUtils.js` contains small request checks, ID creation, and lookup helpers.
- `src/utils/storage.js` safely loads, saves, and resets local browser data.
- `src/styles.css` contains the responsive page styles.

## Collaboration Notes

Work from your group's own Sprint Backlog. Use a branch, make focused commits, open a pull request, and ask a peer to review it before merge. Keep the code change and review evidence connected to the backlog item selected by your group.

## Limitations

This is a client-side demonstration only. It has no backend, authentication, shared database, or cross-device synchronization. Browser data is for local practice and should not be used for sensitive or operational information.
