# Research Search Workspace — Europe PMC

A prototype that lets a researcher **build a literature search without knowing the query syntax**, then read and page through the results. Built on the public [Europe PMC Articles REST API](https://europepmc.org/RestfulWebService) for the EMBL-EBI Front-End Developer exercise (JR4637).

- **Build a query** — add keywords or phrases, combine them with **AND / OR / NOT**, see the query string as it is constructed, remove terms to refine.
- **Explore results** — title, authors, year and a link to each article; **25 per page** with next / previous navigation; loading, empty and error states, all accessible.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Checks

```bash
pnpm typecheck    # strict TypeScript, no `any`
pnpm test         # Vitest + React Testing Library + MSW
pnpm coverage     # coverage report (gate: 80%; actual ~100% lines, 97% branches)
pnpm build        # production build to dist/
pnpm test:live    # optional: end-to-end against the REAL Europe PMC API
```

## How it is built

- **React 18 + TypeScript + Vite**, **TanStack Query** for data, **Tailwind** with EMBL-EBI brand tokens, **Vitest + RTL + MSW** for tests.
- **Feature-Sliced Design.** One feature, `article-search`, owns its screen, parts, API hook and pure helpers. Shared UI primitives (`Button`, `Chip`, `TextField`, `StatusMessage`, `Logo`) live in `src/ui` and are composed into the feature.
- **The pagination mechanism.** The Europe PMC cursor is forward-only (a `nextCursorMark`, no previous cursor). So the app fetches forward with `useInfiniteQuery` and navigates backward with a page pointer over the cached pages — "Previous" never makes a request. This is the main design decision; the full reasoning is in the tech spec.

```
src/
  features/article-search/
    screen/        article-search-screen.tsx + parts/{query-builder,results-panel,status-view}
    api/           use-article-search.ts (hook) · search-articles.ts
    helpers/       build-display-query · build-api-query · build-article-url · create-term  (pure)
    utils/
    article-search.types.ts
  shared/          services/api-client.ts · constants/endpoints.ts · test-utils (MSW) · utils/cn.ts
  ui/              components/{button,chip,text-field,status-message,logo} · icons (proxy)
```

## Documentation

- [`docs/tech-spec.html`](docs/tech-spec.html) — the deep engineering spec: architecture, data flow, the pagination mechanism, state and test design.
- [`docs/ai-usage.md`](docs/ai-usage.md) — how AI was used on this exercise (per EMBL's AI policy).

## Design

The interface uses the EMBL-EBI brand read from their live site — EBI Petrol `#007C82`, EMBL blue, EMBL green, IBM Plex Sans / Mono — so it reads as if it belongs to Europe PMC. Results render as a ruled list, the way Europe PMC lays them out. Light theme only.
