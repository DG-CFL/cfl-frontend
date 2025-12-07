import qs from 'qs'

export type FilterParams = {
  [key: string]: string | number | boolean | undefined
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

/**
 * Serializes QueryParams into a query string
 * Format example: /volunteers?filter[status]=active&sort[sortBy]=createdAt&sort[direction]=desc&page[offset]=2&page[limit]=20
 */
export function serializeParams(params: QueryParams): string {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}
