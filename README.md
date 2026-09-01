# Time Tracker ⏱

A "backend-less" small PWA for tracking working hours in a calendar view. 

> Note: 
> The primary purpose of this project was **learning and experimenting with the browser [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)**.

## How it works

On first launch you choose where data lives:

- **Open existing file** — `showOpenFilePicker()` to pick a `.json` file.
- **Create new file** — `showDirectoryPicker()` to pick a folder, then write a new `data-*.json` into it.
- **Use local storage** — fall back to `localStorage` (works everywhere, no file access).

The chosen `FileSystemFileHandle` is persisted in IndexedDB (via `idb-keyval`) so it can be
re-opened on the next visit without re-prompting. State is managed with Zustand, whose `persist`
middleware is wired to a custom `dualStorage` adapter that reads/writes the file handle and mirrors
to `localStorage` (`src/data/dualStorage.ts`).

> The File System Access API requires a **secure context** (HTTPS or `localhost`) and is currently
> only supported in Chromium-based browsers.

## Tech stack

React + TypeScript, Vite (SWC), Zustand, Luxon, [Prismane](https://www.prismane.io/) UI,
`vite-plugin-pwa` for the service worker / installable manifest.

## Run locally

```bash
npm install
npm run dev      # start the Vite dev server (PWA enabled in dev)
```

Then open the printed `localhost` URL. Other scripts:

```bash
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
```

## Deploy

Hosted on **Firebase Hosting** (project `pwa-time-tracker`, config in `firebase.json`).

```bash
npm run build
firebase deploy
```

Requires the Firebase CLI (`npm i -g firebase-tools`) and `firebase login`. The hosting config
serves the `dist/` folder and rewrites all routes to `index.html` (SPA).
