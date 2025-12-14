/**
 * Recursively converts an object from camelCase keys to snake_case keys
 */
export function camelToSnake(obj: Record<string, any>): any {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }
  if (obj instanceof Date) return obj.toISOString()
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        acc[snakeKey] = camelToSnake(obj[key])
        return acc
      },
      {} as Record<string, any>,
    )
  }
  return obj
}

/**
 * Recursively converts an object from snake_case keys to camelCase keys
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        )
        acc[camelKey] = snakeToCamel(obj[key])
        return acc
      },
      {} as Record<string, any>,
    )
  }
  return obj
}

export function serializeDateWithoutTime(dateTime: Date): string {
  return dateTime.toISOString().split('T')[0]
}
