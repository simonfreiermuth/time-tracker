# Time Tracker ⏱

A backend-less PWA for tracking working hours in a calendar view.

> Note:
> The primary purpose of this project was **learning and experimenting with the browser
> [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)**.

## How it works

On first launch you choose where the data lives:

- **Open existing file** — pick a `.json` file via `showOpenFilePicker()`.
- **Create new file** — pick a folder via `showDirectoryPicker()` and write a new `data-*.json` into it.
- **Use local storage** — fall back to `localStorage` (works everywhere, no file access).

The chosen `FileSystemFileHandle` is kept in IndexedDB (`idb-keyval`) so it re-opens on the next
visit without prompting again. State lives in Zustand, whose `persist` middleware writes through
`src/data/dualStorage.ts` to the file and/or `localStorage`.

Syncing and backup are up to you — put the file wherever you already sync (Dropbox, OneDrive, git, …).

> The File System Access API needs a **secure context** (HTTPS or `localhost`) and currently only
> works in Chromium-based browsers.

## Stack

React + TypeScript, Vite (SWC), Zustand, Luxon, [Prismane](https://www.prismane.io/) UI,
`vite-plugin-pwa` for the service worker and installable manifest.

## Development

Requires [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev       # vite dev server (PWA enabled)
pnpm build     # type-check + production build into dist/
pnpm preview   # serve the production build
pnpm lint      # eslint
```

## Deploy

Hosted on **Firebase Hosting** (project `pwa-time-tracker`, see `firebase.json`):

```bash
pnpm build
firebase deploy
```
