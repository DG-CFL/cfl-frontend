export type FilterParams = {
  [key: string]: unknown
}

export type SortParams = {
  sortBy?: string
  direction?: 'asc' | 'desc'
}

export type PaginationParams = {
  offset?: number
  limit?: number
}

export type QueryParams = {
  filter?: FilterParams
  sort?: SortParams
  page?: PaginationParams
}

export type ApiCollection<T> = {
  items: T[];
  totalCount: number
}
