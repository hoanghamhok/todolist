import api from '../../../api/client'

export type SearchType = "task" | "project" | "all";

export interface SearchResponse {
  tasks: any[];
  projects: any[];
}

export const searchAPI = {
  search: (q: string, type: SearchType = "all") =>
    api.get<SearchResponse>("/search", {
      params: {
        q,
        type,
      },
    }),
};