# Time Tracker ⏱

A backend-less PWA for tracking working hours: a weekly calendar, a project list and a simple
report of hours per project.

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
`vite-plugin-pwa` for the service worker and installable manifest, Vitest + Testing Library
for tests.

## Development

Requires [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev       # vite dev server (PWA enabled)
pnpm build     # type-check + production build into dist/
pnpm preview   # serve the production build
pnpm lint      # eslint
pnpm test      # vitest (jsdom + Testing Library)
```

## Deploy

Pushed to `main` → [CI](.github/workflows/ci.yml) runs lint, tests and build, then publishes
`dist/` to **GitHub Pages**: <https://simonfreiermuth.github.io/time-tracker/>

The repository needs *Settings → Pages → Source: GitHub Actions*. The site lives under a
sub-path, hence `base: "/time-tracker/"` in `vite.config.ts`.
