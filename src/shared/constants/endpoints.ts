/** Single source of truth for backend paths. */
export const EP = {
  EUROPE_PMC: {
    SEARCH: 'https://www.ebi.ac.uk/europepmc/webservices/rest/search',
  },
} as const;

/** Public article URL for a result, built from its source + id. */
export const europePmcArticleUrl = (source: string, id: string): string =>
  `https://europepmc.org/article/${source}/${id}`;
