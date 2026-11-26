# EMBL Research Viewer

A fast, accessible interface for searching the [Europe PMC](https://europepmc.org) literature corpus — 47 million biomedical and life-sciences publications. Build a query from plain keywords, combine them with **AND / OR / NOT**, and read and page through the results, without needing to know any search syntax.

- **Live app:** https://emblresearchviewer.netlify.app/
- **Technical documentation:** https://voluble-lokum-f99f47.netlify.app//
- **Repository:** https://github.com/spiderocious/embl-research-viewer

---

## What it does

**Build a search**
- Add any keyword or phrase; press Enter or click Add.
- Combine terms with AND, OR or NOT using a one-click segmented toggle.
- Change any term's operator in place, or remove it, and the query updates live.
- Start from one of the example queries on a blank slate.

**Explore the results**
- Title, authors, publication year and a link to each article on europepmc.org.
- 25 results per page with Previous / Next navigation.
- Jump straight to any page by number.
- Clear loading, empty and error states throughout.

**Share and return**
- The query and page live in the URL, so any search can be bookmarked or shared — the link restores the exact search.

It is built to be accessible (labelled controls, keyboard operation, live-region announcements) and responsive (a fixed workspace on desktop where the results scroll on their own; a natural, full-height flow on mobile).

---

## Running it locally

Requires Node 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | Strict TypeScript, no `any` |
| `pnpm lint` | Lint with oxlint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run the test suite (Vitest) |
| `pnpm coverage` | Run tests with a coverage report |
| `pnpm test:live` | End-to-end check against the real Europe PMC API |

---

## How it is built

| Area | Choice |
| --- | --- |
| Framework | React 18 + TypeScript + Vite |
| Data | TanStack Query (`useInfiniteQuery`) |
| Styling | Tailwind CSS with Europe PMC brand tokens |
| Testing | Vitest + React Testing Library + MSW |
| Architecture | Feature-Sliced Design |

The app is one feature, `article-search`, that owns its screen, parts, data hook and pure helpers. Reusable UI primitives (`Button`, `Chip`, `TextField`, `SegmentedControl`, `StatusMessage`, `Logo`) live in `src/ui` and are composed into it.

```
src/
  features/article-search/
    screen/        article-search-screen.tsx + parts/{query-builder, results-panel, status-view}
    api/           use-article-search.ts (data hook) · search-articles.ts
    helpers/       build-display-query · build-api-query · build-article-url · url-terms  (pure)
    utils/         use-url-state.ts
    article-search.types.ts
  shared/          services/api-client.ts · constants/endpoints.ts · utils · test-utils (MSW)
  ui/              components/* · icons (proxy)
```

### The pagination design

The Europe PMC search cursor only moves forward — each response hands back a `nextCursorMark`, with no previous cursor and no page or offset parameter. So the app fetches forward with `useInfiniteQuery` and navigates backward with a page pointer over the cached pages, meaning **Previous never makes a request**. Jumping to a page walks the cursor forward to it. The full reasoning, with diagrams, is in the [technical documentation](https://voluble-lokum-f99f47.netlify.app//).

---

## Testing

The suite covers the behaviours that matter — query construction, forward/backward navigation (including that Previous reads from cache rather than refetching), URL restore, and the API-failure path — with the network mocked by MSW. A separate end-to-end check (`pnpm test:live`) drives the real interface against the live Europe PMC API.

---

## Design

The interface uses Europe PMC's own brand — EBI Petrol teal, EMBL blue and green, and IBM Plex Sans / Mono — with results rendered as a ruled list, the way Europe PMC lays them out. Light theme throughout.
