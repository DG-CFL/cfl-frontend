import type { FilterParams, PaginationParams, QueryParams, SortParams } from '@/types/api_utils'
import type { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table'
import qs from 'qs'

/**
 * Serializes QueryParams into a query string
 * Format example: /volunteers?filter[status]=active&sort[sortBy]=createdAt&sort[direction]=desc&page[offset]=2&page[limit]=20
 */
export function serializeParams(params: QueryParams): string {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

/**
 * Converts tanstack table column filters state to FilterParams
 */
export function tableFiltersToFilterParams(filters: ColumnFiltersState): FilterParams {
  const result: Record<string, unknown> = {};
  for (const f of filters) {
    result[f.id] = f.value;
  }
  return result;
}

/**
 * Converts tanstack table sorting state to SortParams
 */
export function tableSortingToSortParams(sorting: SortingState): SortParams {
  if (sorting.length === 0) return {};
  return {
    sortBy: sorting[0].id,
    direction: sorting[0].desc ? "desc" : "asc"
  };
}

/**
 * Converts tanstack paginations state to PaginationParams
 */
export function tablePaginationToPaginationParams(pagination: PaginationState): PaginationParams {
  return {
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize
  }
}
